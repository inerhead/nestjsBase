/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';


export const META_ROLES = 'roles';

export enum ValidRolesEnum {
    ADMIN = 'admin',
    USER = 'user'
}

export const RoleProtected = (...args: ValidRolesEnum[]) => {
    console.log('args', args);
    return SetMetadata(META_ROLES, args);
}
