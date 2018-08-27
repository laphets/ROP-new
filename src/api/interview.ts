import request from '@/utils/request'


import queryString from 'query-string'
import store from '@/store';


export const createInterview = (data: any) => {
    const query = queryString.stringify({instanceId: store.getters.instancdId})
    return request.post(`v1/interview?${query}`, data)
}

export const getInterviewList = (conditions?: any) => {
    const query = queryString.stringify({ instanceId: store.getters.instancdId, ...conditions })
    return request.get(`v1/interview?${query}`)
}