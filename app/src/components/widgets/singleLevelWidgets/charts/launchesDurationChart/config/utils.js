import * as STATUSES from 'common/constants/testStatuses';
import { duration as calculateDuration } from 'moment';
import { messages } from 'components/widgets/common/messages';

export const DURATION = 'duration';
export const TIME_TYPES = {
  SECONDS: 'seconds',
  MINUTES: 'minutes',
  HOURS: 'hours',
};

export const isValueInterrupted = (item) => item.status === STATUSES.INTERRUPTED;
export const getTimeType = (max) => {
  if (max > 0) {
    if (max < 60000) {
      return { value: 1000, type: TIME_TYPES.SECONDS };
    } else if (max <= 2 * 3600000) {
      return { value: 60000, type: TIME_TYPES.MINUTES };
    }
  }
  return { value: 3600000, type: TIME_TYPES.HOURS };
};

export const prepareChartData = (data) => {
  const chartData = [DURATION];
  const itemsData = [];
  let max = 0;
  data.result.forEach((item) => {
    const duration = parseInt(item.duration, 10);
    const { id, name, number } = item;
    const { status, startTime, endTime } = item;
    max = duration > max ? duration : max;
    itemsData.push({
      id,
      name,
      number,
      status,
      startTime,
      endTime,
      duration,
    });
    chartData.push(duration);
  });
  return {
    timeType: getTimeType(max),
    chartData,
    itemsData,
  };
};

export const calculateTooltipParams = (data, color, customProps) => {
  const { itemsData, timeType, formatMessage } = customProps;
  const { name, number, duration, status } = itemsData[data[0].index];
  const abs = Math.abs(duration / timeType.value);
  const humanDuration = isValueInterrupted({ status })
    ? formatMessage(messages.launchInterrupted)
    : calculateDuration(abs, timeType.type).humanize(true);

  return {
    itemName: `${name} #${number}`,
    duration: humanDuration,
  };
};
