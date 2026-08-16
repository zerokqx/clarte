import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Node, NodeSchema } from './entites';
import { NODE_READ_REPO, NODE_WRITE_REPO } from '@/application';
import { NodeReadRepository, NodeWriteRepository } from './repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Node.name, schema: NodeSchema }])],
  providers: [
    {
      provide: NODE_READ_REPO,
      useClass: NodeReadRepository,
    },
    {
      provide: NODE_WRITE_REPO,
      useClass: NodeWriteRepository,
    },
  ],
  exports: [NODE_READ_REPO, NODE_WRITE_REPO],
})
export class DatabaseModule {}
