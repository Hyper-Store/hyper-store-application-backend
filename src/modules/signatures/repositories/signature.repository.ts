import { PrismaClient } from "@prisma/client";
import { SignatureEntity } from "../entities";

export class PrismaSignatureRepository {

    constructor(
        private prismaClient: PrismaClient
    ) {}

    async create(signatureEntity: SignatureEntity): Promise<void> {
        await this.prismaClient.signature.create({
            data: signatureEntity.toJSON()
        })
    }

    async findByUserIdAndServiceId(userId: string, serviceId: string): Promise<SignatureEntity | null> {
        const signature = await this.prismaClient.signature.findFirst({
            where: {
                serviceId,
                userId
            }
        })
        if(!signature) return null
        return SignatureEntity.create(signature, signature.id)
    }

    async update(signatureEntity: SignatureEntity): Promise<void> {
        const { expirationDate } = signatureEntity.toJSON()
        await this.prismaClient.signature.updateMany({
            where: { id: signatureEntity.id },
            data: {
                expirationDate
            }
        })
    }
}