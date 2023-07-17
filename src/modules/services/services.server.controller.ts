import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { 
  CreateServiceDto,
  UpdateNameDto,
  UpdateImageUrlDto
} from './dto';
import { 
  ChangeNameUsecase, 
  CreateServiceUsecase,
  ChangeImageUrlUsecase
} from './usecases';
import { ServerAuthGuard } from 'src/guards';

@Controller('server/services')
export class ServicesController {

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(ServerAuthGuard)
  @Post()
  async create(@Body() body: CreateServiceDto) {
    const createServiceUsecase = new CreateServiceUsecase(this.prismaService)
    return await createServiceUsecase.execute(body)
  }

  @UseGuards(ServerAuthGuard)
  @Patch("/change-name/:serviceId")
  async changeName(
    @Body() body: UpdateNameDto,
    @Param("serviceId") serviceId: string
  ) {
    const changeNameUsecase = new ChangeNameUsecase(this.prismaService)
    return await changeNameUsecase.execute({ ...body, serviceId })
  }

  @UseGuards(ServerAuthGuard)
  @Patch("/change-image-url/:serviceId")
  async changeImageUrl(
    @Body() body: UpdateImageUrlDto,
    @Param("serviceId") serviceId: string
  ) {
    const changeImageUrlUsecase = new ChangeImageUrlUsecase(this.prismaService)
    return await changeImageUrlUsecase.execute({ ...body, serviceId })
  }
}
