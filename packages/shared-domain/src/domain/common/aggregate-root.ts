import { Entity } from './entity'; // Импорт твоего класса Entity

export abstract class AggregateRoot<Props = any> extends Entity<Props> {
  private _domainEvents: any[] = [];

  constructor(props: Props) {
    super(props);
  }

  get domainEvents(): any[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
