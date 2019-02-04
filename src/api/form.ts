import request from '@/utils/request'

export const getFormList = ()  => {
    return request.get('v1/form')
}

export const createForm = (data: any) => {
    return request.post('v1/form', data)
}

export const updateForm = (id: number, data: any) => {
    return request.put(`v1/form/${id}`, data)
}
