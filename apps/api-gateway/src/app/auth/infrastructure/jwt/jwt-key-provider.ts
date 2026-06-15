import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { type IAuthClient, InjectAuthClient } from '@/app/auth/aplication';
import { lastValueFrom } from 'rxjs';
import { Contracts } from '@clarte/shared-contracts';

@Injectable()
export class JwtKeyProvider implements Contracts.Interfaces.IJwtKeyProvider {
  constructor(@InjectAuthClient() private readonly authClient: IAuthClient) {}

  get(): Promise<string> | string {
    const source$ = this.authClient
      .getPublicJwtKey()
      .pipe(map((response) => response.key));
    return lastValueFrom(source$);
  }
}
