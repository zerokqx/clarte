export interface IMapper<R, P, D> {
  toDomain(raw: R): D;
  toPersistence(domain: D): P;
}
