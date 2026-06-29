export class SaveNoteBytesCommand {
  public readonly id!: string;
  public readonly bytes!: Uint8Array;
  public readonly authorId!: string;

  constructor(props: { id: string; bytes: Uint8Array; authorId: string }) {
    Object.assign(this, props);
  }
}
