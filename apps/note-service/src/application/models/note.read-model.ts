export type NoteReadModelProps = Omit<NoteReadModel, never>;

export class NoteReadModel {
  readonly id!: string;
  readonly text!: string;
  readonly tags!: string[];
  readonly authorId!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  // readonly bytes!: Uint8Array;
  constructor(props: NoteReadModelProps) {
    Object.assign(this, props);
  }
}
