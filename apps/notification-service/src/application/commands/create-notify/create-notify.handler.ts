import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotifyCommand } from './create-notify.command';
import { randomUUID } from 'crypto';
import { Notification } from '@/domain';
import { InjectNotificationRepo } from '@/application/decorators';

@CommandHandler(CreateNotifyCommand)
export class CreateNotifyHandler implements ICommandHandler<CreateNotifyCommand> {
  constructor(
@InjectNotificationRepo()
  ) {}

  async execute({ payload }: CreateNotifyCommand): Promise<void> {
    const notification = Notification.create({
      id: randomUUID(),
      userId: payload.userId,
      title: payload.title,
      text: payload.text,
    });

    // Save the notification to PostgreSQL using the DDD repository port/adapter
    await this.notificationRepository.save(notification);
    this.logger.log(`Welcome notification for user ${data.userId} successfully saved to DB.`);
  }
}
