import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Post()
  create(@Body() createSignatureDto: CreateSignatureDto) {
    return this.signaturesService.create(createSignatureDto);
  }

  @Get()
  findAll() {
    return this.signaturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signaturesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSignatureDto: UpdateSignatureDto) {
    return this.signaturesService.update(+id, updateSignatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signaturesService.remove(+id);
  }
}
