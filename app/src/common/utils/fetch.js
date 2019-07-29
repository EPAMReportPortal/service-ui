import axios, { CancelToken } from 'axios';
import { isAuthorizedSelector, logoutAction } from 'controllers/auth';
import { stringify } from 'qs';

export const ERROR_CANCELED = 'REQUEST_CANCELED';
export const ERROR_UNAUTHORIZED = 'UNAUTHORIZED';

const handleError = (error) => {
  if (axios.isCancel(error)) {
    throw new Error(ERROR_CANCELED);
  }
  if (error.response && error.response.status === 401) {
    throw new Error(ERROR_UNAUTHORIZED);
  }
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw error;
};

const handleResponse = (res) => res.data;

export const fetch = (url, options = {}, isRawResponse) => {
  const cancelToken = options && options.abort ? new CancelToken(options.abort) : null;
  const headersFromParams = options && options.headers;
  const headers = Object.assign({}, headersFromParams || {});

  const requestParams = {
    ...options,
    paramsSerializer: () => stringify(options.params),
    cancelToken,
    url,
    headers,
  };

  return axios(requestParams)
    .catch(handleError)
    .then(!isRawResponse ? handleResponse : (response) => response);
};

export const updateToken = (newToken) => {
  axios.defaults.headers.common.Authorization = newToken;
};

export const initAuthInterceptor = (store) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const isAuthorized = isAuthorizedSelector(store.getState());
        isAuthorized && store.dispatch(logoutAction());
      }
      return Promise.reject(error);
    },
  );
};
