/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { META_ROLES, ValidRolesEnum } from './roles.enum';

export const RoleProtected = (...args: ValidRolesEnum[]) => {
    console.log('args2', args);
    return SetMetadata(META_ROLES, args);
}
