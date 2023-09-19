import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const isProduction = process.env.NODE_ENV === "production";
export const emailRegex = isProduction ? /^[^+]*$/ : /[\s\S]*/;

@Injectable()
export class EnvironmentService {
    constructor(private readonly configService: ConfigService) {}

    get PORT(): string | number {
        return this.configService.get("PORT") ?? 3000;
    }

    get DATABASE_URL(): string {
        return (
            this.configService.get("DATABASE_URL") ??
            "postgresql://postgres:mypassword@localhost:5432/"
        );
    }

    get REFRESH_JWT_SECRET(): string {
        return this.configService.get("REFRESH_JWT_SECRET") ?? "1112";
    }

    get ACCESS_JWT_SECRET(): string {
        return this.configService.get("ACCESS_JWT_SECRET") ?? "1113";
    }

    get EMAIL_JWT_SECRET(): string {
        return this.configService.get("EMAIL_JWT_SECRET") ?? "1114";
    }

    get BCRYPT_SALT(): number {
        return this.configService.get("BCRYPT_SALT") ?? 5;
    }

    get ENCRYPTION_SALT(): number {
        return this.configService.get("ENCRYPTION_SALT") ?? 5;
    }

    get DOMAIN(): string {
        return this.configService.get("DOMAIN") ?? "";
    }

    get ENVIRONMENT(): string {
        return this.configService.get("ENVIRONMENT") ?? "dev";
    }

    get FRONTEND_ORIGIN(): string {
        return this.configService.get("FRONTEND_ORIGIN") ?? "http://localhost";
    }
}
