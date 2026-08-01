import { freezeWith } from '@clarte/shared';
import { Command } from '@nestjs/cqrs';

interface UncompleteTodoCommandProps {
  readonly todoId: string;
  readonly userId: string;
}
export class UncompleteTodoCommand extends Command<void> {
  readonly todoId!: string;
  readonly userId!: string;
  constructor(props: UncompleteTodoCommandProps) {
    super();
    freezeWith(this, props);
  }
}
