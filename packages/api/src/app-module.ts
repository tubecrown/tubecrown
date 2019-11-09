import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getPostgresConfig, PostgresConfig } from '@tubecrown/config/lib/postgres'
import { typeOrmConfig } from '@tubecrown/models/lib/typeorm'
import { TaskModule } from './task'
import { VideoModule } from './video'

const postgresConfig: PostgresConfig = getPostgresConfig()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      host: postgresConfig.hostForApi || typeOrmConfig.host,
    }),
    TaskModule,
    VideoModule,
  ],
})
export class AppModule {}
