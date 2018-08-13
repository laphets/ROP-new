import request from '@/utils/request'

export const getInstanceList = () => {
    return request.get('/v1/instance')
}

export const createInstance = (data: any) => {
    return request.post('/v1/instance', data)
}

export const updateInstance = (instanceId: number, data: any) => {
    return request.put(`/v1/instance/${instanceId}`, data)
}
