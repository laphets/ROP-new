import request from '@/utils/request'

export const getDepartmentList = (associationName = "求是潮") => {
    return request.get(`v1/association?associationName=${associationName}`)
}


export const getUserList = () => {
    return request.get(`v1/association/user`)
}
