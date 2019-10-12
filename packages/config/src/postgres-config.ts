import config from 'config'

export interface PostgresConfig {
  readonly host: string
  readonly port: number
  readonly database: string
  readonly username: string
  readonly password: string
}

export const getPostgresConfig = () => config.get<PostgresConfig>('postgres')
