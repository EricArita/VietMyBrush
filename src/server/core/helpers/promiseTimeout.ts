export const promiseTimeout = <T>(promise: Promise<T>, ms = 30000): Promise<T> => {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((_resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(`Timed out in ${ms} 'ms.`);
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout,
    ]) as any;
};
