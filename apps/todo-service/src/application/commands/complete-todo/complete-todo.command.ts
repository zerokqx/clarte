import { freezeWith } from '@clarte/shared';
import { Command } from '@nestjs/cqrs';

interface CompleteTodoProps {
  readonly todoId: string;
  readonly userId: string;
}
export class CompleteTodoCommand extends Command<void> implements CompleteTodoProps {
  readonly todoId!: string;
  readonly userId!: string;
  constructor(props: CompleteTodoProps) {
    super();
    freezeWith(this, props);
  }
}
