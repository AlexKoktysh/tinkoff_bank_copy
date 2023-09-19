export class CreateAuthDto {}

export class SignUpDto {
    email: string;
    password: string;
    login: string;
}

export class JwtPayloadDto {
    readonly id?: string;
    readonly email: string;
    readonly iat?: number;
    readonly exp?: number;
}

export class SignInDto {
    email: string;
    password: string;
}
