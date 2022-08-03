import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const Roles = (...roles: Role[]) => {
  const fullRoles = roles.includes(Role.USER) ? [Role.ADMIN, ...roles] : roles;
  return SetMetadata('roles', fullRoles);
};
