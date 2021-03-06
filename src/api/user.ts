import request from '@/utils/request'
import { UserInfoResponse } from '@/api/interfaces/user.interface';

export const loginByQSC = () => {
    return request.post('v1/auth/login/qsc')
}

export const loginByPasswd = (data: any) => {
    return request.post('v1/auth/login/passwd', data)
}

export const getAssociation = () => {
    return request.get('v1/auth/association')
}

export const getUserInfo = () => {
    return request.get<UserInfoResponse>('v1/user/info')
}

export const updateAvatar = (url: string) => {
    return request.post('v1/user/avatar', {url})
}

export const getSMSInfo = () => {
    return request.get('v1/user/sms')
}
