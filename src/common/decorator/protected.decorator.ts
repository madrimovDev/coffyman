import { ApiBearerAuth } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';

interface ProtectedOption {
  isPublic?: boolean;
  roles?: Role[];
}

export function Protected({ isPublic = false, roles = [] }: ProtectedOption) {
  if (isPublic) {
    return applyDecorators(Public());
  } else {
    return applyDecorators(ApiBearerAuth(), Roles(...roles));
  }
}
