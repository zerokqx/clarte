import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPublicJwtKeyQuery } from '@/application/queries/get-public-jwt-key/get-public-jwt-key.query';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';

@QueryHandler(GetPublicJwtKeyQuery)
export class GetPublicJwtKeyHandler
  implements IQueryHandler<GetPublicJwtKeyQuery>
{
  async execute(): Promise<string> {
    const getAssetsPath = () => {
      const distAssets = join(__dirname, 'assets');
      if (existsSync(distAssets)) {
        return distAssets;
      }
      return join(__dirname, '..', '..', '..', 'assets');
    };

    const assetsDir = getAssetsPath();
    return fs.readFile(join(assetsDir, 'public.key'), 'utf-8');
  }
}
