export const addFullName = (params: { givenName: string, familyName: string, middleName?: string, type: 'givenNameFirst' | 'familyNameFirst' }) => {
  return (params.type === 'givenNameFirst'
    ? [params.givenName, params.middleName, params.familyName]
    : [params.familyName, params.middleName, params.givenName])
    .filter((name) => name)
    .join(' ');
};
