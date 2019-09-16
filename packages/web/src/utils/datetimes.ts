import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatFromNow = (dateToFormat: string): string => {
  return dayjs(dateToFormat).fromNow()
}
