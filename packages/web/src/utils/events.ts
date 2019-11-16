import VueRouter from 'vue-router'
import { SimpleDate } from '../components/filter'

const isModifiedClickEvent = (event: MouseEvent): boolean => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export const isPureClickEvent = (event: MouseEvent): boolean => {
  // Inspired from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js
  return event.button === 0 && !isModifiedClickEvent(event)
}

export const routeBySimpleDateEvent = (simpleDate: SimpleDate, route: VueRouter): void => {
  if (simpleDate.month === 'any') {
    route.push(`/${simpleDate.year}`)
  } else if (simpleDate.day === 'any') {
    route.push(`/${simpleDate.year}/${simpleDate.month}`)
  }
  route.push(`/${simpleDate.year}/${simpleDate.month}/${simpleDate.day}`)
}