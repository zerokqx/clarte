import { DatabaseConfig } from '@clarte/shared-nest/modules';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseConfig],
})
export class DatabaseModule {}
