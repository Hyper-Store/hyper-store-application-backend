import { PrismaClient, User } from "@prisma/client";
import { UserEntity } from "../entities/user.entity";
import { Injectable } from "@nestjs/common";

class PrismaUserEntityMapper {
    static toDomain(user: User): UserEntity {
        return new UserEntity({
            ...user
        }, user.id)
    }
}

@Injectable()
export class PrismaUserRepository {

    constructor( private prismaClient: PrismaClient ){}

    async create(userEntity: UserEntity): Promise<void>{
        await this.prismaClient.user.create({
            data: {
                ...userEntity.toJSON()
            }
        })
    }

    async findByEmail(email: string): Promise<UserEntity | null>{
        const user = await this.prismaClient.user.findFirst({
            where: { email }
        })
        if(!user) return null
        return PrismaUserEntityMapper.toDomain(user)
    }

    async findByUsername(username: string): Promise<UserEntity | null>{
        const user = await this.prismaClient.user.findFirst({
            where: { username }
        })
        if(!user) return null
        return PrismaUserEntityMapper.toDomain(user)
    }
}