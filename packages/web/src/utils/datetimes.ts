import { DateTime, Duration } from 'luxon'

export const formatFromNow = (dateToFormat: string): string | null => {
  return DateTime.fromISO(dateToFormat).toRelative()
}

export const formatDuration = (durationToFormat: string): string => {
  const duration = Duration.fromISO(durationToFormat)
  return duration.get('hour') > 0 ? duration.toFormat('h:mm:ss') : duration.toFormat('m:ss')
}
