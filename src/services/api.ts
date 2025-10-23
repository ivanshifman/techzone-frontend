/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from "axios";

export interface ResponsePayload {
  success: boolean;
  message: string;
  result: any;
}
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError | any) => {
    if (axios.isCancel(error)) {
      console.warn("Request canceled:", error.message);
      return Promise.reject(error);
    }
    console.error("API Error:", error.response?.data?.errorResponse?.message || error.message);
    return Promise.reject(error);
  }
);

const responseBody = (
  response: AxiosResponse<ResponsePayload>
): ResponsePayload => response.data;

const requests = {
  get: (url: string) => api.get<ResponsePayload>(url).then(responseBody),
  getSignal: (url: string, signal: AbortSignal) =>
    api.get<ResponsePayload>(url, { signal }).then(responseBody),
  post: (url: string, body: any) =>
    api.post<ResponsePayload>(url, body).then(responseBody),
  put: (url: string, body: any) =>
    api.put<ResponsePayload>(url, body).then(responseBody),
  patch: (url: string, body: any) =>
    api.patch<ResponsePayload>(url, body).then(responseBody),
  delete: (url: string) =>
    api.delete<ResponsePayload>(url).then(responseBody),
};

export default requests;
