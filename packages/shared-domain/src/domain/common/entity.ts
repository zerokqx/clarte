import { ValueObject } from './vo';

export abstract class Entity<Props extends { id: any } = any> {
  protected readonly _id: string;
  protected readonly _props: Props;

  constructor(props: Props) {
    this._props = props;
    const id = props.id;
    this._id = id instanceof ValueObject ? String(id.value) : String(id);
  }

  get id(): string {
    return this._id;
  }

  public equals(other?: Entity<any>): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this._id === other.id;
  }

  abstract toPlain(): object;
}
