import { Key, PrismaClient } from "@prisma/client";
import { KeyEntity } from "../entities";


class PrismaKeyEntityMapper {
    static toDomain(prismaKey: Key){
        const keyEntity = KeyEntity.create({
            ...prismaKey
        }, prismaKey.id)
        if(prismaKey.status === "REDEEMED") keyEntity.redeem(prismaKey.keyRedeemerId)
        if(prismaKey.status === "DISABLED") keyEntity.disable()
        return keyEntity
    }
}

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

    async findByKey(key: string): Promise<KeyEntity | null> {
        const keyEntity = await this.prismaClient.key.findFirst({
            where: { key: key ?? "" }
        })
        if(!keyEntity) return null
        return PrismaKeyEntityMapper.toDomain(keyEntity)
    }

    async update(keyEntity: KeyEntity): Promise<void> {
        const { id, serviceId, key, ...props } = keyEntity.toJSON()
        await this.prismaClient.key.update({
            where: { id: keyEntity.id },
            data: {
                ...props
            }
        })
    }

    async delete(id: string): Promise<void> {
        await this.prismaClient.key.deleteMany({
            where: { id: id ?? "" }
        })
    }
    
}