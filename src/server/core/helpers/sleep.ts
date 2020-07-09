export const sleep = async (ms: number) => {
    if (!(ms > 0)) {
        throw Error('invalid time');
    }
    return await new Promise((resolve) => setTimeout(resolve, ms));
};
