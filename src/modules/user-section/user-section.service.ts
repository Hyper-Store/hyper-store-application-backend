import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSectionEntity } from './entities';
import { MongoUserSectionRepository } from './repositories';
import { RegisterSectionDto } from './dto';

@Injectable()
export class UserSectionService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async registerSection(input: RegisterSectionDto) {
        const mongoUserSectionRepository = new MongoUserSectionRepository()
        const userSection = new UserSectionEntity({
            ...input,
            
        })
        await mongoUserSectionRepository.create(userSection)
    }

}
