import { isDeepStrictEqual } from 'util';

export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
      return false;
    }

    return isDeepStrictEqual(this.value, other.value);
  }

  get value(): T {
    return this._value;
  }
}
