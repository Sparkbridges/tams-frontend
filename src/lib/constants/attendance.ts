export const attendanceTimezones = Array.from({ length: 53 }, (_, index) => {
  const minutes = -750 + index * 30
  const hours = Math.floor(Math.abs(minutes) / 60)
  const halfHour = Math.abs(minutes) % 60 ? ':30' : ''
  return {
    value: String(minutes % 60 === 0 ? minutes / 60 : minutes),
    label:
      minutes === 0
        ? 'Etc/GMT'
        : `Etc/GMT${minutes < 0 ? '-' : '+'}${hours}${halfHour}`,
  }
})
