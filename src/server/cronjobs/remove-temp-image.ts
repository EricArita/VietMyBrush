import schedule from 'node-schedule';
// import * as fs from 'fs';
import { logger } from '@app/core';

const start = (_callback: any) => {
  schedule.scheduleJob('*/30 * * * *', async () => {
    logger.info('Finish delete temporary image record');
    logger.info('Finish checking outdated items');
  });
};

// function deleteFiles(files: any, callback: any) {
//   if (files.length === 0) callback();
//   else {
//     const f = files.pop();
//     fs.unlink(f, (err) => {
//       if (err) {
//         logger.error('[Remove-Temp-Image-Cron-Error]: ' + err.message);
//         deleteFiles(files, callback);
//       } else {
//         // tslint:disable-next-line
//         console.log(f + ' deleted.');
//         deleteFiles(files, callback);
//       }
//     });
//   }
// }

export default { start };
