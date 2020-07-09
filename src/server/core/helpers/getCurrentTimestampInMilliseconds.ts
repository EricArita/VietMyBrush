import moment from 'moment';
export const getCurrentTimestampInMilliseconds = () => {
    return moment().valueOf();
};
