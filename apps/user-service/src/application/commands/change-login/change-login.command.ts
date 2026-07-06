import { Command } from '@nestjs/cqrs';

interface ChangeLoginCommandProps {
  userId: string;
  login: string;
}
export class ChangeLoginCommand extends Command<void> {
  readonly userId!: string;
  readonly login!: string;
  constructor(props: ChangeLoginCommandProps) {
    super();
    Object.assign(this, props);
  }
}
