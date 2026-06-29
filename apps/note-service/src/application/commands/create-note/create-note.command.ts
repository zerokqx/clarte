import { Command } from '@nestjs/cqrs';

export type CreateNoteCommandProps = {
  text: string;
  tags: string[];
  bytes: Uint8Array | null;
  authorId: string;
};
export class CreateNoteCommand extends Command<string> implements CreateNoteCommandProps {
  public readonly text!: string;
  public readonly tags!: string[];
  public readonly bytes!: Uint8Array | null;
  public readonly authorId!: string;

  constructor(props: CreateNoteCommandProps) {
    super();
    Object.assign(this, props);
  }
}
