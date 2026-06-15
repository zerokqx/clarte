import { ConfigModule} from "@nestjs/config"
import { Module } from "@nestjs/common";

@Module({
imports:[
ConfigModule.forFeature()
  ]
})
export class AppConfigModule{}
