import { SetMetadata } from '@nestjs/common';
import { PermissionFeatureType } from '@prisma/client';

export const Permissions = (
  feature: PermissionFeatureType,
  action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
) => SetMetadata('feature', feature) && SetMetadata('action', action);
