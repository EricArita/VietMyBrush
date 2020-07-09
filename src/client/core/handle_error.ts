// import { showNotification } from './show_notification';

export interface ErrorWithCode extends Error {
  code?: string;
  message: string;
}
export const handleError = (
  error: ErrorWithCode,
  // ignoreCodes?: { [code: string]: true },
): void => {
  if (!error.code) {
    throw error;
  }
  // if (ignoreCodes && ignoreCodes[error.code]) {
  //   return;
  // }
  // const message = matchedCodes[error.code] || error.message;
};
