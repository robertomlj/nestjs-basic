import { SetMetadata } from '@nestjs/common';

export const PROPERTIES_KEY = 'properties';
export const CanAdminUpdate = (...properties: string[]) =>
  SetMetadata(PROPERTIES_KEY, properties);
