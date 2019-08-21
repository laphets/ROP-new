import request from '@/utils/request'


import queryString from 'query-string'
import store from '@/store';


export const createInterview = (data: any) => {
    const query = queryString.stringify({instanceId: store.getters.instanceId})
    return request.post(`v1/interview?${query}`, data)
}

export const getInterviewList = (conditions?: any) => {
    conditions.department = conditions.department === 'interviewoverview' ? undefined : conditions.department
    const query = queryString.stringify({ instanceId: store.getters.instanceId, ...conditions })
    return request.get(`v1/interview?${query}`)
}

export const enableInterview = (interviewId: any) => {
    return request.post(`v1/interview/enable/${interviewId}`)
}

export const disableInterview = (interviewId: any) => {
    return request.post(`v1/interview/disable/${interviewId}`)
}
