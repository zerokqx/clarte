import { IJwtPayload } from '@clarte/shared-contracts/interfaces';

export interface IJwtValidator {
  validate(token: string): Promise<IJwtPayload>;
}
