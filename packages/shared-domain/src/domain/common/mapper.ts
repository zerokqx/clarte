export interface IMapper<Raw, Persistence, Domain> {
  toDomain(raw: Raw): Domain;
  toPersistence(domain: Domain): Persistence;
}
