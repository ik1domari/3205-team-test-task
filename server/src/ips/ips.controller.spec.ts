import { Test, TestingModule } from '@nestjs/testing';
import { IpsController } from './ips.controller';
import { IpsService } from './ips.service';

describe('IpsController', () => {
  let controller: IpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpsController],
      providers: [IpsService],
    }).compile();

    controller = module.get<IpsController>(IpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
