import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma/prisma.service";
import { CreateServiceUsecase } from "./usecases";


@Injectable()
export class DefaultServiceCreationService implements OnModuleInit {
    
    constructor(
        private readonly prismaService: PrismaService
    ){}
    
    async onModuleInit() {
        const createServiceUsecase = new CreateServiceUsecase(this.prismaService)

        await createServiceUsecase.execute({
            name: "default-service",
            imageUrl: "any_image",
            type: "default"
        })

        await createServiceUsecase.execute({
            name: "default-service",
            imageUrl: "any_image",
            type: "default"
        })
    }

}