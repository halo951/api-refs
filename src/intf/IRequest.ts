import * as axios from 'axios'

export type IRequest = <T = any, R = axios.AxiosResponse<T>, D = any>(config: axios.AxiosRequestConfig<D>) => Promise<R>
