import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { CreateAuthDto, JwtPayloadDto, SignUpDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { UserService } from "../user/user.service";
import {
    EControllerName,
    ETokenLifeTime,
    ETokenType,
} from "src/constants/enum";
import { EnvironmentService } from "src/environment/environment.service";
import { User } from "@prisma/client";

const ms = require("ms");

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly environmentService: EnvironmentService,
        private readonly userService: UserService,
    ) {}

    async injectJWTIntoCookies(
        response: Response,
        jwtPayloadDto: JwtPayloadDto,
        tokenType: ETokenType,
        cookiePath = "/",
    ) {
        const [tokenSecret, tokenLifeTime] =
            tokenType === ETokenType.ACCESS
                ? [
                      this.environmentService.ACCESS_JWT_SECRET,
                      ETokenLifeTime.ACCESS,
                  ]
                : [
                      this.environmentService.REFRESH_JWT_SECRET,
                      ETokenLifeTime.REFRESH,
                  ];

        const token = await this.createAuthToken(
            jwtPayloadDto,
            tokenSecret,
            tokenLifeTime,
        );

        response.cookie(tokenType, token, {
            httpOnly: true,
            expires: new Date(Date.now() + ms(ETokenLifeTime.COOKIE)),
            secure: this.environmentService.ENVIRONMENT === "production",
            sameSite: "strict",
            domain: this.environmentService.DOMAIN,
            path: cookiePath,
        });
    }

    async authorizeUser(response: Response, { email }: User | JwtPayloadDto) {
        const jwtPayloadDto = { email };

        await this.injectJWTIntoCookies(
            response,
            jwtPayloadDto,
            ETokenType.ACCESS,
        );

        await this.injectJWTIntoCookies(
            response,
            jwtPayloadDto,
            ETokenType.REFRESH,
            `/${EControllerName.AUTH}`,
        );
    }

    async signOut(response: Response) {
        response.clearCookie(ETokenType.ACCESS);
        response.clearCookie(ETokenType.REFRESH, {
            path: `/${EControllerName.AUTH}`,
        });
    }

    async createUser({ email, password, login }: SignUpDto) {
        const newUser = await this.userService.createUser({
            email,
            password,
            login,
        });

        return newUser;
    }

    async extractUserPayloadFromToken(token: string, tokenType: ETokenType) {
        const secret =
            tokenType === ETokenType.REFRESH
                ? this.environmentService.REFRESH_JWT_SECRET
                : tokenType === ETokenType.ACCESS
                ? this.environmentService.ACCESS_JWT_SECRET
                : this.environmentService.EMAIL_JWT_SECRET;

        const userPayload: JwtPayloadDto = await this.jwtService.verifyAsync(
            token,
            {
                secret,
            },
        );

        return { id: userPayload.id, email: userPayload.email };
    }

    async createAuthToken(
        payload: JwtPayloadDto,
        secret: string,
        expiresIn: string,
    ) {
        return this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });
    }

    extractJWT(req: Request): string | null {
        const token = req.rawHeaders.find((el) => el.includes("access-token"))?.split("=")[1];
        return token ? token : null;
    }
}
