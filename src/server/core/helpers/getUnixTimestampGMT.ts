import moment from 'moment';
export const getUnixTimeFromCalendarDayFormat = (dayFormatStr: string | number): number => {
  const targetMoment = moment(dayFormatStr);
  const date = new Date();
  const offsetInHours = date.getTimezoneOffset() / 60;
  const unixTimestamp = targetMoment.valueOf() - offsetInHours * 3600 * 1000;
  return unixTimestamp;
};
