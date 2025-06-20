import axios, { type AxiosRequestConfig } from "axios";
interface RequestOptions extends AxiosRequestConfig {
  token?: string;
}

const requestClient = (options: RequestOptions = {}) => {

const opts: RequestOptions = Object.assign({}, options, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${options.token}`,
    }
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 120000,
    ...opts,
  });

  return axiosInstance;
};

export default requestClient;
