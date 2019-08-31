import { Injectable } from '@nestjs/common'
import { FilterXSS } from 'xss'

const xss = new FilterXSS()

@Injectable()
export class HtmlService {
  sanitize (html: string): string {
    return xss.process(html)
  }
}
