import axios from 'axios';
import { errorHandler, useHandleResponseBlob } from './tools';

export const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    token: '',
  },
});

request.interceptors.request.use(
  (config) => {
    console.log('request.interceptors.request 2');
    return config;
  },
  (err) => {
    return Promise.reject(errorHandler.wrapDataToErrorFirstStyle(err, true));
  }
);

request.interceptors.response.use(
  (response) => {
    let resData = useHandleResponseBlob(response, Date.now());
    if (!resData.data || resData.code === -1) {
      resData = response.data;
    }
    if (!resData.data) {
      resData = errorHandler.auth(response);
    }
    return errorHandler.wrapDataToErrorFirstStyle(resData);
  },
  (err) => {
    let error = errorHandler.network(err.response);
    return Promise.reject(errorHandler.wrapDataToErrorFirstStyle(error));
  }
);
