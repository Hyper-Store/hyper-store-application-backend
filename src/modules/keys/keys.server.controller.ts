import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
  GenerateKeyUsecase, 
  ActivateKeyUsecase,
  DisableKeyUsecase,
  DeleteKeyUsecase,
  
} from './usecases';
import { ServerAuthGuard } from 'src/guards';
import { StatusChangeDto } from './dto/status-change.dto';

@Controller('server/keys')
export class KeysServerController {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  @UseGuards(ServerAuthGuard)
  @Post()
  async create(@Body() body: CreateKeyDto) {
    const generateKeyUsecase = new GenerateKeyUsecase(this.prismaService)
    return await generateKeyUsecase.execute(body)
  }

  @UseGuards(ServerAuthGuard)
  @Post()
  async disable(@Body() body: StatusChangeDto) {
    const disableKeyUsecase = new DisableKeyUsecase(this.prismaService)
    return await disableKeyUsecase.execute(body)
  }

  @UseGuards(ServerAuthGuard)
  @Post()
  async activate(@Body() body: StatusChangeDto) {
    const activateKeyUsecase = new ActivateKeyUsecase(this.prismaService)
    return await activateKeyUsecase.execute(body)
  }

  @UseGuards(ServerAuthGuard)
  @Post("/:key")
  async delete( 
    @Param("key") key: string
  ) {
    const deleteKeyUsecase = new DeleteKeyUsecase(this.prismaService)
    return await deleteKeyUsecase.execute({ key })
  }


}
