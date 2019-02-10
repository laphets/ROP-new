import request from '@/utils/request'

export const getMessageHistory = (interviewId: number) => {
    return request({
        isSocket: true,
        url: `/history/${interviewId}`,
        method: 'get'
    } as any)
}
