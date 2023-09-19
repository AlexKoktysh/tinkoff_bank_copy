import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "../environment/environment.service";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly environmentService: EnvironmentService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: authService.extractJWT,
            ignoreExpiration: false,
            secretOrKey: environmentService.ACCESS_JWT_SECRET,
        });
    }

    async validate(payload: JwtPayloadDto) {
        const user = await this.userService.getUser(payload);

        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }
        return user;
    }
}
