import request from '@/utils/request'

export const getFormList = () => {
    return request.get('v1/form')
}
