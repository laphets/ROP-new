import { AxiosRequestConfig } from 'axios';

export interface MyAxiosConfig extends AxiosRequestConfig {
    isSocket: boolean;
}
