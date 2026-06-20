import { Marks } from '@clarte/shared';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { InjectUserClient, type IUserClient } from '@/app/user/application';
import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { AccessGuard } from '@clarte/shared-nest/guards';
import { User } from '@clarte/shared-nest/decorators';
import { UserS3StorageDTO } from './dto';

@Controller('users')
export class UserStorageController extends Marks.Controller.Private {
  constructor(
    @InjectUserClient()
    private readonly userClient: IUserClient,
  ) {
    super();
  }

  @Get('s3-storage')
  @AccessGuard()
  @ApiOperation({
    summary: 'Получить presigned URL для загрузки аватара в S3',
  })
  @ApiOkResponse({ type: UserS3StorageDTO })
  getPresignedUrl(@User() user: IJwtPayload): Observable<UserS3StorageDTO> {
    return this.userClient.uploadPresignedUrl({ userId: user.sub }).pipe(
      map(
        (raw) =>
          new UserS3StorageDTO({
            urlPublic: raw.urlPublic,
            urlPresigned: raw.urlPresigned,
          }),
      ),
    );
  }
}
