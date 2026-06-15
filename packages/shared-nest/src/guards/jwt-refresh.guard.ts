import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}
export const RefreshGuard = () => UseGuards(RefreshAuthGuard);
