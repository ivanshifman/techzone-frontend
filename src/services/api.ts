import axios, { AxiosResponse } from "axios";

export interface ResponsePayload<T = any> {
  success: boolean;
  message: string;
  result: T;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const responseBody = <T>(
  response: AxiosResponse<ResponsePayload<T>>
): ResponsePayload<T> => response.data;

const requests = {
  get: <T>(url: string) => api.get<ResponsePayload<T>>(url).then(responseBody),
  post: <T>(url: string, body: any) =>
    api.post<ResponsePayload<T>>(url, body).then(responseBody),
  put: <T>(url: string, body: any) =>
    api.put<ResponsePayload<T>>(url, body).then(responseBody),
  patch: <T>(url: string, body: any) =>
    api.patch<ResponsePayload<T>>(url, body).then(responseBody),
  delete: <T>(url: string) =>
    api.delete<ResponsePayload<T>>(url).then(responseBody),
};

export default requests;
