import { Inject } from '@nestjs/common';
import { USER_RMQ_CLIENT } from '../ports/di-tokens';

export const InjectUserRmqClient = () => Inject(USER_RMQ_CLIENT);
