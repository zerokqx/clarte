import { ValueObject } from './vo';

export interface EntityBaseProps {
  id: string | ValueObject<string>;
}
export abstract class Entity<Props extends EntityBaseProps = EntityBaseProps> {
  protected readonly _props: Props;

  constructor(props: Props) {
    this._props = props;
  }

  get id(): string {
    const id = this._props.id;
    return id instanceof ValueObject ? String(id.value) : String(id);
  }

  public equals(other?: Entity): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this.id === other.id;
  }

  abstract toPlain(): object;
}
