import axios from 'axios';
import config from '../config';

export default function apiClient(req) {
  const instance = axios.create({
    baseURL: config.baseUrl + '/api',
    timeout: 12000
  });

  instance.interceptors.response.use(
    response => {
      return response.data
    },
    error => Promise.reject(error.response ? error.response.data : error)
  );

  return instance;
}