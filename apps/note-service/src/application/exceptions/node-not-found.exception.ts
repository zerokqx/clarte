export class NodeNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NodeNotFoundException';
  }
}

export const NoteNotFoundException = NodeNotFoundException;
