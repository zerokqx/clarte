import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { type IAuthClient, InjectAuthClient } from '@/app/auth/aplication';
import { lastValueFrom } from 'rxjs';
import { type IJwtKeyProvider } from '@clarte/shared-contracts/interfaces';

@Injectable()
export class JwtKeyProvider implements IJwtKeyProvider {
  constructor(@InjectAuthClient() private readonly authClient: IAuthClient) {}

  get(): Promise<string> | string {
    const source$ = this.authClient
      .getPublicJwtKey()
      .pipe(map((response) => response.key));
    return lastValueFrom(source$);
  }
}
