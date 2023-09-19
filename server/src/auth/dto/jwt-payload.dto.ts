export class JwtPayloadDto {
    readonly id: string;
    readonly email: string;
    readonly iat?: number;
    readonly exp?: number;
}
