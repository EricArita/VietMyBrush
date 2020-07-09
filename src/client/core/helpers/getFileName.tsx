// fileName after uploading:
// abc.txt => abc.<Date number>.txt
// this function helps to get the original filename
export const getFileName = (fileName: string) => {
    const lastDot = fileName.lastIndexOf('.');
    const fileNameAndTime = fileName.slice(0, lastDot);
    return fileNameAndTime.replace(/.(\d+){12}$/g, '') + fileName.slice(lastDot);
};
