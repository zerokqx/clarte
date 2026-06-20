import { Inject } from '@nestjs/common';
import { USER_CLIENT } from '@/app/user/application/ports';

export const InjectUserClient = () => Inject(USER_CLIENT);
