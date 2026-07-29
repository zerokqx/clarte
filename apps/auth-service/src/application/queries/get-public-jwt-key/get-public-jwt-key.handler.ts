import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPublicJwtKeyQuery } from '@/application/queries/get-public-jwt-key/get-public-jwt-key.query';
import { promises as fs } from 'fs';
import { join } from 'path';
import { p, sslKey } from '@clarte/shared';

@QueryHandler(GetPublicJwtKeyQuery)
export class GetPublicJwtKeyHandler implements IQueryHandler<GetPublicJwtKeyQuery> {
  async execute(): Promise<string> {
    const assetsDir = join(__dirname, p(2), 'assets');
    return fs.readFile(join(assetsDir, sslKey('public')), 'utf-8');
  }
}
