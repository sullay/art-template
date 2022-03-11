export function isEvent(key) {
  return key.startsWith('on');
}

export function getEventName(key) {
  return key.toLowerCase().replace(/^on/, "");
}