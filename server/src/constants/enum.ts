export enum ETokenType {
    ACCESS = "access-token",
    REFRESH = "refresh-token",
    EMAIL = "email-token",
}

export enum ETokenLifeTime {
    ACCESS = "24h",
    REFRESH = "24h",
    EMAIL = "30d",
    COOKIE = "399d",
}

export enum EControllerName {
    AUTH = "auth",
}

export enum EMetadataKey {
    ENDPOINT_TYPE,
}
