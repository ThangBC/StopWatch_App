import moment from 'moment';
const converTime = text => {
  const duration = moment.duration(text);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    convertTimeZero(duration.minutes()) +
    ':' +
    convertTimeZero(duration.seconds()) +
    ',' +
    convertTimeZero(centiseconds)
  );
};

const convertTimeZero = text => {
  return text < 10 ? '0' + text : text;
};

export {converTime, convertTimeZero};
