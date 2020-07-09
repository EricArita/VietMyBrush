/**
 * encode json object to base 64 string
 */
export const encodeBase64 = (obj: object) => {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
};
