import moment from 'moment';
export const getCurrentTimestampInSeconds = () => {
    return moment().unix();
};
