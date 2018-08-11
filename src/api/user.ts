import request from '@/utils/request'

export const login = () => {
    return request.post('/v1/auth/login')
}
