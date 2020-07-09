import { isDev } from '@app/core';

export const rootLocation = isDev ? 'src' : 'dist';
