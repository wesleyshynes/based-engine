export function getTimeStamp(timeInMilli: number) {
  const currentTime = timeInMilli
  const minutes = Math.floor(currentTime/60000)
  const seconds = Math.floor((currentTime%60000)/1000)
  const millis = currentTime - (minutes*60000) - (seconds*1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${millis < 100 ? 0 : ''}${millis < 10 ? 0 : ''}${millis}`
}
