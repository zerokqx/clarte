
export class NoteReadModel {
  constructor(
    readonly id: string,
    readonly text: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
