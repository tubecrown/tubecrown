import { Injectable } from '@nestjs/common'
import { AxiosError } from 'axios'

@Injectable()
export class LogService {
  logError (err: AxiosError) {
    console.log(err.message)
    if (err.isAxiosError && err.response) {
      console.log(err.response.status)
      console.log(err.response.headers)
      console.log(err.response.data)
    } else {
      console.log(err.stack)
    }
  }
}
