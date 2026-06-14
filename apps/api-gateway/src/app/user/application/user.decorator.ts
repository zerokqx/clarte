import { Inject } from '@nestjs/common';
import { USER_CLIENT } from './ports';

export const InjectUserClient = () => Inject(USER_CLIENT);
