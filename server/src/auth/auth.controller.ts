import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { CreateAuthDto, SignInDto, SignUpDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { UserService } from "src/user/user.service";
import { ETokenType } from "src/constants/enum";
import { Public } from "../decorators/public.decorator";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Public()
    @Post("signup")
    async signUp(
        @Res({ passthrough: true }) response: Response,
        @Body() dto: SignUpDto,
    ) {
        const user = await this.authService.createUser(dto);
        await this.authService.authorizeUser(response, user);

        return { message: "Successfully signed up" };
    }

    @Public()
    @Post("signin")
    async signIn(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.userService.getUserByEmail(signInDto.email);

        await this.authService.authorizeUser(response, user);

        return { message: "Successfully signed in" };
    }

    @Public()
    @Get("signout")
    async signOut(@Res({ passthrough: true }) response: Response) {
        this.authService.signOut(response);
        return { message: "Successfully signed out" };
    }

    @Get("refresh")
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = request.rawHeaders.find((el) =>
            el.includes("refresh-token"),
        );
        const refreshToken = tokens
            .split(";")
            ?.find((el) => el.includes("refresh-token"))
            ?.split("=")[1];

        const payload = await this.authService.extractUserPayloadFromToken(
            refreshToken,
            ETokenType.REFRESH,
        );

        await this.authService.authorizeUser(response, payload);

        return { message: "Token successfully refreshed" };
    }
}
