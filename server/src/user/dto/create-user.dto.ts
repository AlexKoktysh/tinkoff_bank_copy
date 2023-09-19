import { Optional } from "@nestjs/common";

export class CreateUserDto {
    @Optional()
    readonly login: string;
    readonly email: string;
    readonly password: string;
}
