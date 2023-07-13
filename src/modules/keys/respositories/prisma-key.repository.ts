import { PrismaClient } from "@prisma/client";
import { KeyEntity } from "../entities";

export class PrismaKeyRepository {

    constructor(
        private readonly prismaClient: PrismaClient
    ){}

    async create(keyEntity: KeyEntity): Promise<void> {
        await this.prismaClient.key.create({
            data: {
                ...keyEntity.toJSON()
            }
        })
    }

    
}