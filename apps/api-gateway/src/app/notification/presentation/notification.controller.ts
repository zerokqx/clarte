import { Marks } from '@clarte/shared';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { InjectNotificationClient, type INotificationClient } from '@/app/notification/application';
import { NotificationDTO } from './dto';
import { type IJwtPayload } from '@clarte/shared-contracts/interfaces';
import { AccessGuard } from '@clarte/shared-nest/guards';
import { User } from '@clarte/shared-nest/decorators';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController extends Marks.Controller.Private {
  constructor(
    @InjectNotificationClient()
    private readonly notificationClient: INotificationClient,
  ) {
    super();
  }

  @Get()
  @AccessGuard()
  @ApiOperation({ summary: 'Получить список уведомлений текущего пользователя' })
  @ApiOkResponse({ type: [NotificationDTO] })
  getUserNotifications(
    @User() user: IJwtPayload,
  ): Observable<NotificationDTO[]> {
    return this.notificationClient.getNotificationsById(user.sub).pipe(
      map((res) =>
        (res.notifications || []).map(
          (n) =>
            new NotificationDTO({
              id: n.id,
              title: n.title,
              text: n.text,
              createdAt: n.createdAt,
            }),
        ),
      ),
    );
  }
}
