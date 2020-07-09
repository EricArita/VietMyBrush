import { config } from '@client/config';
import { ErrorWithCode } from '@client/core';
import * as jsCookie from 'js-cookie';

interface GETParams {
  path: string;
  params?: { [key: string]: string | number | Filter[] | string[] | number[] };
  errorCode?: string;
  tokenId?: string;
}

interface Filter {
  [key: string]: string | number | undefined;
}

interface PostParams {
  path: string;
  params: { [key: string]: string | number | Filter[] | undefined | Filter | string[] | boolean };
  errorCode?: string;
  tokenId?: string;
}

const defaultError = 'Error occured. Please try again';

const objToQueryString = (obj: { [key: string]: string | number | Filter[] | string[] | number[] }): string => {
  const keyValuePairs: string[] = [];
  Object.keys(obj).forEach((el: string) => {
    if (obj[el].constructor === Array) {
      const filter = obj[el] as Filter[];
      filter.map((item, index) => {
        if (typeof item === 'object') {
          Object.keys(item).forEach((attr) => {
            if (item[attr] !== undefined) {
              const filterItem = item[attr];
              if (typeof filterItem === 'object') {
                Object.keys(filterItem).forEach((filterValue) => {
                  if (Array.isArray(filterItem[filterValue])) {
                    const filterArray = filterItem[filterValue] as any[];
                    filterArray.map((filterArrayItem: any, ind: number) => {
                      const urlValue = `${el}[${attr}][${ind}][${filterValue}]=${filterArrayItem}`;
                      keyValuePairs.push(urlValue);
                    });
                  } else {
                    if (typeof filterItem[filterValue] === 'object') {
                      Object.keys(filterItem[filterValue]).map((it: any) => {
                        if (Array.isArray(filterItem[filterValue][it])) {
                          const itArray = filterItem[filterValue][it] as any[];
                          itArray.map((e: any, i: number) => {
                            const url = `${el}[${attr}][${filterValue}][${it}][${i}]=${e}`;
                            keyValuePairs.push(url);
                          });
                        }
                      });
                    } else {
                      const url = `${el}[${attr}][${filterValue}]=${encodeURIComponent(
                        filterItem[filterValue] as string,
                      )}`;
                      keyValuePairs.push(url);
                    }
                  }
                });
              }
              // const url = `${el}[${attr}]=${encodeURIComponent(item[attr] as string)}`;
            }
          });
        } else if (item) {
          const url = `${el}[${index}]=${encodeURIComponent(item)}`;
          keyValuePairs.push(url);
        } else {
          const url = `${el}[${index}]=%00`;
          keyValuePairs.push(url);
        }

        return item;
      });
    } else {
      keyValuePairs.push(`${encodeURIComponent(el)}=${encodeURIComponent(obj[el] as string)}`);
    }
  });

  return keyValuePairs.join('&');
};

const getIdToken = async (): Promise<string | undefined> => {
  return '123';
};

export const fetchPOST = async <T>({ path, params, errorCode }: PostParams): Promise<T> => {
  const tokenId = await getIdToken();
  const response = await fetch(`${config.url.proxy}/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: tokenId || '',
    },
    body: JSON.stringify(params),
  });
  if (response.status === 200 || response.status === 201) {
    const ret = await response.json();
    return ret;
  }

  const error = new Error() as ErrorWithCode;
  error.code = defaultError;
  if (errorCode) {
    error.code = errorCode;
  }
  throw error;
};

export const fetchGET = async <T>({ path, params, errorCode }: GETParams): Promise<T> => {
  const tokenId = await getIdToken();
  let url = `${config.url.proxy}/${path}`;
  if (params) {
    url += `?${objToQueryString(params)}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: tokenId || '',
    },
  });
  if (response.status === 200 || response.status === 201) {
    const ret = await response.json();
    return ret;
  }

  const error = new Error() as ErrorWithCode;
  error.code = defaultError;
  if (errorCode) {
    error.code = errorCode;
  }

  throw error;
};

export const fetchAPI = async <T>(
  method: string,
  { path, params, errorCode, tokenId }: GETParams,
  proxy = false,
): Promise<T> => {
  const token = tokenId ? tokenId : jsCookie.get('token');
  let url = config.url.host;
  let apiMethod = method;
  let bodyRequest = params;
  if (method === 'GET' || method === 'PATCH') {
    bodyRequest = {
      model: path,
    };
    const controller = 'api/Clusters/request';
    apiMethod = 'POST';
    url = `${config.url.proxy}${controller}`;
    if (params) {
      if (method === 'PATCH' || proxy === true) {
        bodyRequest.body = params as any;
        bodyRequest.model += `?appcode=${config.appCode}&token=${token}`;
      } else {
        bodyRequest.model += `?${objToQueryString(params)}&appcode=${config.appCode}&token=${token}`;
      }
    } else {
      bodyRequest.model += `?appcode=${config.appCode}&token=${token}`;
    }
    bodyRequest.proxy = config.url.proxy;
    bodyRequest.method = proxy ? 'post' : method.toLowerCase();
  } else {
    url += path;
    if (bodyRequest !== undefined && path !== 'contracts' && path !== 'parcels') {
      bodyRequest.applicationId = config.appId;
    }
  }
  // console.log(bodyRequest.model);

  const response = await fetch(url, {
    method: apiMethod,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appcode: config.appCode,
      token: token ? token : '',
    },
    body: JSON.stringify(bodyRequest),
  });
  if (response.status === 200 || response.status === 201) {
    const ret = await response.json();
    if (ret.res && ret.res.error && ret.res.error.statusCode && ret.res.error.statusCode === 401) {
      localStorage.clear();
      window.location.href = '/auth/logout';
    }
    if (ret.res && ret.res.error && ret.res.error.statusCode && ret.res.error.statusCode === 400) {
      localStorage.clear();
      window.location.href = '/auth/logout';
    }
    return ret;
  }

  const error = new Error() as ErrorWithCode;
  error.code = defaultError;
  if (errorCode) {
    error.code = errorCode;
  }

  throw error;
};

// Hàm linkModel
// 1. data: Là mảng data
// 2. model: tên model muốn link
// 3. key: field để link. Vd với company thì key là companyId

export const linkModel = async (data: any, model: string, key: string) => {
  try {
    const linkedData = [] as any;
    await Promise.all(
      data.map(async (el: any) => {
        const ret = (await fetchAPI('GET', {
          path: `${model}/${el[key]}`,
        })) as any;
        linkedData.push({
          ...el,
          [`${key}`]: ret.res.data[0],
        });
      }),
    );
    return linkedData;
  } catch (error) {
    return error;
  }
};
