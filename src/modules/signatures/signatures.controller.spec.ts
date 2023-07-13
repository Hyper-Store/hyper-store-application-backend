import { Test, TestingModule } from '@nestjs/testing';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';

describe('SignaturesController', () => {
  let controller: SignaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignaturesController],
      providers: [SignaturesService],
    }).compile();

    controller = module.get<SignaturesController>(SignaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
