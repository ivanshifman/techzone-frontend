import axios, { AxiosError, AxiosResponse } from "axios";

export interface ResponsePayload {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError | any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (axios.isCancel(error)) {
      console.warn("Request canceled:", error.message);
      return Promise.reject(error);
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const responseBody = <T>(
  response: AxiosResponse<ResponsePayload>
): ResponsePayload => response.data;

const requests = {
  get: <T>(url: string) => api.get<ResponsePayload>(url).then(responseBody),
  getSignal: <T>(url: string, signal: AbortSignal) =>
    api.get<ResponsePayload>(url, { signal }).then(responseBody),
  post: <T>(url: string, body: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api.post<ResponsePayload>(url, body).then(responseBody),
  put: <T>(url: string, body: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api.put<ResponsePayload>(url, body).then(responseBody),
  patch: <T>(url: string, body: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api.patch<ResponsePayload>(url, body).then(responseBody),
  delete: <T>(url: string) =>
    api.delete<ResponsePayload>(url).then(responseBody),
};

export default requests;
