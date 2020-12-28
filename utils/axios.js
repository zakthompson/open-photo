import axios from 'axios';

const instance = axios.create({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (e) => {
    if (window && e.response.status === 401) {
      window.location.href = '/api/auth/login';
    }
    return Promise.reject(e);
  },
);

export default instance;
