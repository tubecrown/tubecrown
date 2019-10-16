import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { job } from 'cron'
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
  job({
    cronTime: '0 */1 * * * *',
    onTick: () => {
      console.log('cron', new Date())
    },
    start: true,
  })
}

if (require.main === module) {
  start().catch(console.error)
}
