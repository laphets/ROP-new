import request from '@/utils/request'

export const getDepartmentList = (associationName: string) => {
    return request.get(`v1/association/name/${associationName}`)
}

export const createAssociation = (data: any) => {
    return request.post(`v1/association`,  data)
}

export const getAssociationList = () => {
    return request.get(`v1/association`)
}

export const addUser = (data: any) => {
    return request.post('v1/association/user', data)
}

export const getUserList = () => {
    return request.get(`v1/association/user`)
}
