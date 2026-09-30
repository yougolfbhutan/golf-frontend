import axios from "axios";

const apiClient = axios.create({
 timeout: 5000, // 5 seconds timeout
  withCredentials: true,// 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;