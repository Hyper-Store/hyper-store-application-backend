import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSectionEntity } from './entities';
import { MongoUserSectionRepository } from './repositories';
import { RegisterSectionDto } from './dto';
import { JwtGateway } from '../auth/gateways';

@Injectable()
export class UserSectionService {

    constructor(

    ){}

    async registerSection(input: RegisterSectionDto) {
        const payload = await JwtGateway.verifyAccessToken(input.accessToken)
        if(!payload) return null
        const mongoUserSectionRepository = new MongoUserSectionRepository()

        const currentUserSection = await mongoUserSectionRepository.findByUserId(payload.userId)
        if(!currentUserSection) {
            const userSection = new UserSectionEntity({
                ...input,
                userId: payload.userId,
            })
            return await mongoUserSectionRepository.create(userSection)
        }
        currentUserSection.update(input)
        await mongoUserSectionRepository.update(currentUserSection)
    }

    static async verifySection(accessToken: string): Promise<JwtGateway.JwtModel | null> {
        const payload = await JwtGateway.verifyAccessToken(accessToken)
        if(!payload) return null

        const mongoUserSectionRepository = new MongoUserSectionRepository()
        const userSection = await mongoUserSectionRepository.findByAccessToken(accessToken)
        if(!userSection) return null

        return payload
    }

}
