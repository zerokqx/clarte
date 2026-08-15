import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveNoteBytesCommand } from './save-note-bytes.command';
import { InjectNodeRepo } from '@/application/decorators';
import type { INodeRepositoryWrite } from '@/application/ports';
import { NodeNotFoundException } from '@/application/exceptions';
import { Effect, pipe } from 'effect';

@CommandHandler(SaveNoteBytesCommand)
export class SaveNoteBytesHandler implements ICommandHandler<SaveNoteBytesCommand> {
  constructor(@InjectNodeRepo('w') private readonly nodeWriteRepo: INodeRepositoryWrite) {}

  async execute(command: SaveNoteBytesCommand): Promise<void> {
    const program = pipe(
      Effect.tryPromise({
        try: () => this.nodeWriteRepo.findById(command.id),
        catch: (error) => error,
      }),
      Effect.flatMap((node) =>
        node
          ? Effect.succeed(node)
          : Effect.fail(new NodeNotFoundException(`Node id=${command.id} not found`)),
      ),
      Effect.tap((node) => {
        node.changeBytes(command.bytes);
      }),
      Effect.flatMap((node) =>
        Effect.tryPromise({
          try: () => this.nodeWriteRepo.save(node),
          catch: (error) => error,
        }),
      ),
    );

    await Effect.runPromise(program);
  }
}
