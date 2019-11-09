import { DateTime } from 'luxon'

export const getDateTimeString = (datetime: DateTime): string => {
  return datetime.toISO()
}

export const getNowString = (): string => {
  return getDateTimeString(getNow())
}

export const getNow = (): DateTime => {
  return DateTime.utc()
}

export const parseDateTime = (dateTimeIso: string): DateTime => {
  return DateTime.fromISO(dateTimeIso).toUTC()
}
