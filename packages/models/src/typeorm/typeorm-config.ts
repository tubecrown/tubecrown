import config from 'config'
import path from 'path'
import { ConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

interface PostgresConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  ...config.get<PostgresConfig>('postgres'),
  entities: [path.join(__dirname, '../**/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  // Migrations
  migrationsTableName: 'typeorm_migrations',
  migrations: ['migrations/*.ts'],
  cli: { migrationsDir: 'migrations' },
}

export = typeOrmConfig
