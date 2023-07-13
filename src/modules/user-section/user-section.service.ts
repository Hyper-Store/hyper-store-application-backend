import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSectionEntity } from './entities';
import { MongoUserSectionRepository } from './repositories';

@Injectable()
export class UserSectionService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async registerSection(input: UserSectionEntity.Props) {
        const mongoUserSectionRepository = new MongoUserSectionRepository()
        const userSection = new UserSectionEntity(input)
        await mongoUserSectionRepository.create(userSection)
    }

}
