import request from '@/utils/request'


export const getInfo = (uid: string) => {
    return request.get(`v1/ssr/register?uid=${uid}`)
}

export const register = (data: any) => {
    return request.post(`v1/ssr/register`, data)
}
