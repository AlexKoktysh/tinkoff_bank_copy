import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { EnvironmentModule } from "./environment/environment.module";
import { AppLoggerMiddleware } from "./middleware/logger";

@Module({
    imports: [AuthModule, UserModule, PrismaModule, EnvironmentModule],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes("*");
    }
}
