import { ICommand } from '@nestjs/cqrs';

export type CreateNoteCommandProps = Omit<CreateNoteCommand, never>;

export class CreateNoteCommand implements ICommand {
  public readonly text!: string;
  public readonly tags!: string[];
  public readonly bytes!: Uint8Array | null;

  constructor(props: CreateNoteCommandProps) {
    Object.assign(this, props);
  }
}
