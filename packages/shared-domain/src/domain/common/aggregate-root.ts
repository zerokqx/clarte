/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Class } from 'type-fest';
import { Entity, EntityBaseProps } from './entity';

export interface IDomainEvent<Name extends string = string, Payload = unknown> {
  readonly eventName: Name;
  readonly occurredAt: Date;
  readonly payload: Payload;
}

type IDomainEventClass<Name extends string, P> = Class<IDomainEvent<Name, P>, [P]>;

export const defineDomainEvent = <Name extends string>(eventName: Name) => {
  return <Payload>(): IDomainEventClass<Name, Payload> => {
    class Event implements IDomainEvent<Name, Payload> {
      readonly eventName: Name = eventName;
      readonly occurredAt: Date = new Date();
      readonly payload!: Payload;

      constructor(payload: Payload) {
        this.payload = payload;
      }
    }
    return Event as IDomainEventClass<Name, Payload>;
  };
};

export const hasPayload = <N extends string, T>(
  event: IDomainEvent<N, unknown>,
): event is IDomainEvent<N, T> => {
  return event.payload !== undefined && event.payload !== null;
};

type AnyDomainEventClass = IDomainEventClass<any, any>;

export type ExtractUnionEvents<T extends AnyDomainEventClass[]> = InstanceType<T[number]>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const unionEvents = <T extends AnyDomainEventClass[]>(..._args: T) => {
  return null as unknown as ExtractUnionEvents<T>;
};

export abstract class AggregateRoot<
  Props extends EntityBaseProps,
  Events extends ReturnType<typeof unionEvents> = never,
> extends Entity<Props> {
  private _domainEvents: Events[] = [];

  constructor(props: Props) {
    super(props);
  }

  get domainEvents(): Events[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: Events): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
