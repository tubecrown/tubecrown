const isModifiedClickEvent = (event: MouseEvent): boolean => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export const isPureClickEvent = (event: MouseEvent): boolean => {
  // Inspired from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js
  return event.button === 0 && !isModifiedClickEvent(event)
}
