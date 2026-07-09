export abstract class Entity<Props = any> {
  protected readonly _id: string;
  protected readonly _props: Props;

  constructor(props: Props) {
    this._props = props;
    if (typeof props === 'object' && props !== null) {
      const anyProps = props as any;
      this._id =
        typeof anyProps.id === 'object' && anyProps.id && 'value' in anyProps.id
          ? String(anyProps.id.value)
          : String(anyProps.id ?? '');
    } else {
      this._id = String(props ?? '');
    }
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
