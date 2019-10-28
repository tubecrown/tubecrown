import { getPostgresConfig } from '@tubecrown/config/lib/postgres'
import path from 'path'
import { ConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  ...getPostgresConfig(),
  entities: [path.join(__dirname, '../**/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  // Migrations
  migrationsTableName: 'typeorm_migrations',
  migrations: ['migrations/*.ts'],
  cli: { migrationsDir: 'migrations' },
}

export = typeOrmConfig
