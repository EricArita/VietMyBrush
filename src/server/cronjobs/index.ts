import removeTempImage from './remove-temp-image';
const startAll = (cb: any) => {
  removeTempImage.start(cb);
};
export default { startAll };
