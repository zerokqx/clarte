import { Entity } from './entity'; // Импорт твоего класса Entity

export abstract class AggregateRoot extends Entity {
  private _domainEvents: any[] = [];

  constructor(id: string) {
    super(id);
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
