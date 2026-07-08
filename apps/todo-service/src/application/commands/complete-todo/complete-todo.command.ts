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
    Object.assign(this, props);
  }
}
