import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtPayloadDto } from "src/auth/dto/jwt-payload.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        return this.prisma.user.create({ data: createUserDto });
    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async getUser(jwtPayloadDto: JwtPayloadDto) {
        const { email } = jwtPayloadDto;
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        return user;
    }

    async getUserById(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async getAllUser() {
        return this.prisma.user.findMany();
    }
}
