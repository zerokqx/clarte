import { Command } from '@nestjs/cqrs';

export type CreateNoteCommandProps = {
  text: string;
  tags: string[];
  bytes: Uint8Array | null;
};
export class CreateNoteCommand
  extends Command<void>
  implements CreateNoteCommandProps
{
  public readonly text!: string;
  public readonly tags!: string[];
  public readonly bytes!: Uint8Array | null;

  constructor(props: CreateNoteCommandProps) {
    super();
    Object.assign(this, props);
  }
}
