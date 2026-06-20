import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AccessAuthGuard extends AuthGuard('jwt-access') {}
export const AccessGuard = () => UseGuards(AccessAuthGuard);
