import axios from 'axios';

const instance = axios.create({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
