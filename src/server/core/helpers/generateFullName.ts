export const generateFullName = (payload: any, isReverse?: boolean) => {
  return !isReverse ?
    ((payload.lastName ? payload.lastName : '') + (payload.lastName ? ' ' : '')  +
      (payload.firstName ? payload.firstName : '')).toLowerCase() :
    ((payload.firstName ? payload.firstName : '') + (payload.firstName ? ' ' : '')  +
      (payload.lastName ? payload.lastName : '')).toLowerCase();
};
