import axios from 'axios';
 
const instance = axios.create();
 
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or sessionStorage.getItem()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
export default instance;