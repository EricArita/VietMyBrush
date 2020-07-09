/**
 * decode base 64 string to json object
 */
export const decodeBase64 = <T>(str: string) => {
    return JSON.parse(Buffer.from(str, 'base64').toString('ascii')) as T;
};
