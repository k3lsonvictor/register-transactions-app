import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.106:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export async function apiConfig<T>(config: AxiosRequestConfig): Promise<T>{
  try {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw error;
  }
}