import { Command } from '@nestjs/cqrs';

export class CreateNoteCommand {
  public readonly text!: string;
}

export type Props = Omit<CreateNoteCommand, never>;
const p: Props = { text: "hello" };
