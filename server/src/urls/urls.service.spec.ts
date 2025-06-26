import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlsService } from './urls.service';
import { UrlEntity } from './entities/url.entity';
import { IpsService } from '../ips/ips.service';
import {
  BadRequestException,
  GoneException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

describe('UrlsService', () => {
  let service: UrlsService;
  let urlRepository: Repository<UrlEntity>;
  let ipsService: IpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(UrlEntity),
          useClass: Repository,
        },
        {
          provide: IpsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlRepository = module.get<Repository<UrlEntity>>(
      getRepositoryToken(UrlEntity),
    );
    ipsService = module.get<IpsService>(IpsService);
  });

  describe('create', () => {
    it('should generate shortUrl when alias not provided', async () => {
      const createDto = { originalUrl: 'https://example.com' };
      const saveSpy = jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValueOnce({ shortUrl: 'abc123' } as UrlEntity);

      const result = await service.create(createDto, 1);

      expect(saveSpy).toHaveBeenCalled();
      expect(result.shortUrl).toBeDefined();
    });

    it('should throw error for long alias', async () => {
      const createDto = {
        originalUrl: 'https://example.com',
        alias: 'this-is-a-very-long-alias-that-exceeds',
      };

      await expect(service.create(createDto, 1)).rejects.toThrow(
        NotAcceptableException,
      );
    });

    it('should save with provided alias', async () => {
      const createDto = {
        originalUrl: 'https://example.com',
        alias: 'my-alias',
      };
      const saveSpy = jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValueOnce({ shortUrl: 'my-alias' } as UrlEntity);

      await service.create(createDto, 1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ alias: 'my-alias' }),
      );
    });
  });

  describe('findOne', () => {
    it('should redirect to original URL', async () => {
      const mockUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortUrl: 'abc123',
        clickCount: 0,
        expiresAt: null,
      } as unknown as UrlEntity;

      jest.spyOn(urlRepository, 'findOne').mockResolvedValueOnce(mockUrl);
      jest.spyOn(urlRepository, 'save').mockResolvedValueOnce(mockUrl);

      const result = await service.findOne('abc123', '192.168.0.1');

      expect(result.originalUrl).toBe('https://example.com');
      expect(result.clickCount).toBe(1);
      expect(ipsService.create).toHaveBeenCalledWith({
        ip: '192.168.0.1',
        urlId: 1,
      });
    });

    it('should throw for expired URL', async () => {
      const expiredDate = new Date(Date.now() - 86400000);
      const mockUrl = {
        originalUrl: 'https://example.com',
        expiresAt: expiredDate,
      } as UrlEntity;

      jest.spyOn(urlRepository, 'findOne').mockResolvedValueOnce(mockUrl);

      await expect(service.findOne('abc123', '192.168.0.1')).rejects.toThrow(
        GoneException,
      );
    });

    it('should throw for non-existent URL', async () => {
      jest.spyOn(urlRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('invalid', '192.168.0.1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
