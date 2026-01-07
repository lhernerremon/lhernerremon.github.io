import type { Dayjs } from 'dayjs'

type DayjsInput = string | number | Date | Dayjs | null | undefined

export default () => {
  const dayjs = useDayjs()

  const timezone = dayjs.tz.guess()
  const dayjsTz = (v?: DayjsInput) => dayjs(v).tz(timezone)

  const formatDatetime = (v?: DayjsInput) => dayjsTz(v).format('D MMM YYYY, HH:mm')
  const formatDate = (v?: DayjsInput) => dayjsTz(v).format('D MMM YYYY')

  const formatTime = (v?: DayjsInput) => dayjsTz(v).format('HH:mm')

  const formatDatetimeFromNow = (v?: DayjsInput) => dayjsTz(v).fromNow()

  return {
    timezone,
    dayjsTz,
    formatDatetime,
    formatDate,
    formatTime,
    formatDatetimeFromNow,
  }
}
