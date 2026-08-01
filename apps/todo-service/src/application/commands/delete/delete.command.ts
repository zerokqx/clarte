import { freezeWith } from '@clarte/shared';
import { Command } from '@nestjs/cqrs';

interface DeleteCommandProps {
  readonly userId: string;
  readonly todoId: string;
}
export class DeleteCommand extends Command<void> implements DeleteCommandProps {
  readonly userId!: string;
  readonly todoId!: string;

  constructor(props: DeleteCommandProps) {
    super();
    freezeWith(this, props);
  }
}
