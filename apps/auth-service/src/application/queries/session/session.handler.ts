import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SessionQuery } from './session.query';

@QueryHandler(SessionQuery)
export class SessionHandler implements IQueryHandler<SessionQuery> {
  constructor() {}

}
