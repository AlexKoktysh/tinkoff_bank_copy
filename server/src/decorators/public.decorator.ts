import { SetMetadata } from "@nestjs/common";
import { EMetadataKey } from "../constants/enum";

export const Public = () => SetMetadata(EMetadataKey.ENDPOINT_TYPE, true);
