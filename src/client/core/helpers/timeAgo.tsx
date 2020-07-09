import moment from 'moment';
const DAY_MINISECONDS = 3600000 * 24;

export const timeAgo = (date: number) => {
    const now = moment().valueOf();
    const miniSeconds = date - now;
    if (miniSeconds < 0) {
        // if the date is not overdue
        if (Math.abs(miniSeconds) <= 3 * DAY_MINISECONDS) return moment(date).fromNow();
        return moment(date).format('MMMM Do YYYY, HH:mm');
    }
    else {
        if (Math.abs(miniSeconds) <= DAY_MINISECONDS) return moment(date).fromNow();
        return moment(date).format('MMMM Do YYYY, HH:mm');
    }
};
