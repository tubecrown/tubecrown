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
  if (simpleDate.month === 'Any') {
    route.push(`/${simpleDate.year}`)
    return
  }
  if (simpleDate.day === 'Any') {
    route.push(`/${simpleDate.year}/${simpleDate.month}`)
    return
  }
  route.push(`/${simpleDate.year}/${simpleDate.month}/${simpleDate.day}`)
}
