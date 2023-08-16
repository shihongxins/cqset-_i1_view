import axios from 'axios';
import { useUserIntercetorsConfig, errorHandler, useHandleResponseBlob } from './tools';

export const userIntercetorsConfig = useUserIntercetorsConfig();

export const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    common: {
      token: '',
    },
  },
  userIntercetorsConfig,
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
    let {
      config: { userIntercetorsConfig },
    } = response;
    if (userIntercetorsConfig?.response?.enable) {
      try {
        let resData;
        if (userIntercetorsConfig.response.autoDeconstructionData) {
          resData = useHandleResponseBlob(response, Date.now());
          if (!resData.data || resData.code === -1) {
            resData = response.data;
          }
          if (!resData.data) {
            resData = errorHandler.auth(response);
          }
        } else {
          resData = response;
        }
        return userIntercetorsConfig.response.useErrorFirstStyle
          ? errorHandler.wrapDataToErrorFirstStyle(resData)
          : resData;
      } catch (error) {
        return userIntercetorsConfig.response.useErrorFirstStyle
          ? errorHandler.wrapDataToErrorFirstStyle(error || response, true)
          : error;
      }
    }
    return response;
  },
  (err) => {
    let {
      config: { userIntercetorsConfig },
    } = err;
    if (userIntercetorsConfig?.response?.enable) {
      let error = userIntercetorsConfig.response.autoDeconstructionData
        ? errorHandler.network(err.response)
        : err;
      return Promise.reject(
        userIntercetorsConfig.response.useErrorFirstStyle
          ? errorHandler.wrapDataToErrorFirstStyle(error)
          : error
      );
    }
    return err;
  }
);
