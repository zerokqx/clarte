import { CreateNoteCommand } from '@/application/commands/create-note';
import { Notes } from '@clarte/shared-contracts/proto';
import { CommandBus } from '@nestjs/cqrs';

@Notes.NotesServiceControllerMethods()
export class NotesController implements Notes.NotesServiceController {
  constructor(private readonly commandBus: CommandBus) {}
  async createNote(request: Notes.CreateNoteRequest): Promise<void> {
    await this.commandBus.execute(new CreateNoteCommand(request.text));
    return {} as any;
  }
}
