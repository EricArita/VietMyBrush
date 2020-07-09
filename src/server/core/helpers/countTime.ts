import moment from 'moment';

export const countTime = async (promise: Promise<void>) => {
    const startTime = moment();
    await promise;
    const endTime = moment();
    return endTime.diff(startTime, 'millisecond');
};
