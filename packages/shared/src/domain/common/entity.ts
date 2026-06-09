export abstract class Entity {
  protected readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }


  public equals(other?: Entity): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this._id === other.id;
  }
}
