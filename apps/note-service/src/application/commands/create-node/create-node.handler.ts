import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNodeCommand } from './create-node.command';
import { randomUUID } from 'crypto';
import { Node } from '@/domain';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryWrite } from '@/application/ports';
import { Effect, pipe } from 'effect';
import { DatabaseException } from '@/application/exceptions';

@CommandHandler(CreateNodeCommand)
export class CreateNodeHandler implements ICommandHandler<CreateNodeCommand> {
  constructor(@InjectNodeRepo('w') private readonly nodeWriteRepo: INodeRepositoryWrite) {}

  async execute(command: CreateNodeCommand): Promise<string> {
    const node = Node.create({
      id: randomUUID(),
      label: command.label,
      content: command.content,
      tags: command.tags,
      bytes: command.bytes,
      authorId: command.authorId,
      parentId: command.parentId,
      linksTo: command.linksTo,
      type: command.type,
    });
    const program = pipe(
      Effect.tryPromise({
        try: () => this.nodeWriteRepo.save(node),
        catch: (err) => new DatabaseException('Write error', { err }),
      }),
      Effect.map(() => node.id),
    );
    return Effect.runPromise(program);
  }
}
