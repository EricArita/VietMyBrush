import fs from 'fs-extra';
import path from 'path';
import { config } from '@app/config';

export const saveFileStream = async (stream: NodeJS.ReadableStream, filePath: string) => {
  const saveLocation = `${config.storage.folder}${filePath.indexOf('/') === 0 ? filePath : '/' + filePath}`;
  await fs.ensureDir(path.dirname(saveLocation));
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(saveLocation);
    stream.pipe(fileStream);
    stream.on('error', (error: any) => {
      reject(error);
    });
    fileStream.on('finish', () => {
      resolve();
    });
  });
};
