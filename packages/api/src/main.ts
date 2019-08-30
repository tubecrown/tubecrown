import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import morgan from 'morgan'
import { AppModule } from './app-module'

export const start = async () => {
  const app: INestApplication = await NestFactory.create(AppModule)
  app.use(helmet())
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }
  await app.listen(4100)
}

if (require.main === module) {
  start().catch(console.error)
}
