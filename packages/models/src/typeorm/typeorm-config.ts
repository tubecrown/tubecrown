import { getPostgresConfig } from '@tubecrown/config/lib/postgres'
import path from 'path'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const typeOrmConfig: PostgresConnectionOptions = {
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
