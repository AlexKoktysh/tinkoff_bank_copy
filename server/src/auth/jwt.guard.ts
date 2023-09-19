import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { EMetadataKey } from "../constants/enum";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isEndpointPublic = this.reflector.getAllAndOverride<boolean>(
            EMetadataKey.ENDPOINT_TYPE,
            [context.getHandler(), context.getClass()],
        );

        if (isEndpointPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
