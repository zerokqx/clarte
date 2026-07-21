import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotifyCommand } from './create-notify.command';
import { randomUUID } from 'crypto';
import { Notification } from '@/domain';
import { InjectNotificationRepo} from '@/application/decorators';
import { INotificationRepository } from '@/application/ports';
import { Logger } from '@nestjs/common';
import { CqrsRepoType } from '@clarte/shared-nest/types';

@CommandHandler(CreateNotifyCommand)
export class CreateNotifyHandler implements ICommandHandler<CreateNotifyCommand> {
  private readonly logger = new Logger(CreateNotifyHandler.name);

  constructor(
    @InjectNotificationRepo(CqrsRepoType.w)
    private readonly writeRepo: INotificationRepository[CqrsRepoType.w],
  ) {}

  async execute({ payload }: CreateNotifyCommand): Promise<void> {
    const notification = Notification.create({
      id: randomUUID(),
      userId: payload.userId,
      title: payload.title,
      text: payload.text,
    });

    await this.writeRepo.save(notification);
    this.logger.log(`Notification for user ${payload.userId} successfully saved to DB.`);
  }
}
