import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentService } from "./environment/environment.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const environmentService: EnvironmentService = app.get(EnvironmentService);

    app.enableCors({
        credentials: true,
        allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        origin: ["http://localhost", environmentService.FRONTEND_ORIGIN],
    });

    await app.listen(environmentService.PORT);
}
bootstrap();
