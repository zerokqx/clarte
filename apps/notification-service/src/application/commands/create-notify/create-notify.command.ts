import { ICommand } from '@nestjs/cqrs';

interface CreateNotifyCommandProps {
  readonly text: string;
  readonly userId: string;
  readonly title: string;
}

export class CreateNotifyCommand implements ICommand {
  constructor(public readonly payload: CreateNotifyCommandProps) {
    Object.freeze(this);
  }
}
