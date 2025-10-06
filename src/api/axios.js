import axios from 'axios';
import { getCookie } from './cookies';

export const backendUrl = () => {
  const remoteUrl = 'https://love-meet.onrender.com/lovemeet';
  return  remoteUrl;
};

const api = axios.create({
  baseURL: backendUrl(),
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    try {
      console.log('[api] response', {
        url: response.config?.url,
        status: response.status,
        data: response.data,
      });
    } catch (e) {}
    return response.data;
  },
  (error) => {
    try {
      console.error('[api] response error', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        responseData: error.response?.data,
        request: error.request,
      });
    } catch (e) {}
    return Promise.reject(error?.response?.data || error);
  },
);

export default api;
