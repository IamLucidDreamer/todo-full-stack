import axios from 'axios';

const serverV1 = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', 
  timeout: 600000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

serverV1.interceptors.response.use(
  response => response.data, 
  error => {
    console.error('API Error:', error?.response || error.message);
    return Promise.reject(error);
  }
);

export default serverV1;
