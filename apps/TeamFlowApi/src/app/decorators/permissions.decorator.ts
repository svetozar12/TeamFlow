import { SetMetadata } from '@nestjs/common';
import { ActionsEnum, Modules } from '@prisma/client';

export const Permissions = (feature: Modules, action: ActionsEnum) =>
  SetMetadata('feature', feature) && SetMetadata('action', action);
