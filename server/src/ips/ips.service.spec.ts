import { Test, TestingModule } from '@nestjs/testing';
import { IpsService } from './ips.service';

describe('IpsService', () => {
  let service: IpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpsService],
    }).compile();

    service = module.get<IpsService>(IpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
