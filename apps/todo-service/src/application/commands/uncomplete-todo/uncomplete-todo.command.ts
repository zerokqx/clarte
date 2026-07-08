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
    Object.assign(this, props);
    Object.freeze(this);
  }
}
