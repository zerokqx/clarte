import { Query } from '@nestjs/cqrs';

export interface AccessCheckQueryProps {
  readonly authorId: string;
  readonly noteId: string;
}

export class AccessCheckQuery extends Query<boolean> implements AccessCheckQueryProps {
  readonly authorId!: string;
  readonly noteId!: string;
  constructor(props: AccessCheckQueryProps) {
    super();
    Object.assign(this, props);
  }
}
