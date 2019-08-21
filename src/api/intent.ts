import request from '@/utils/request'

import queryString from 'query-string'
import store from '@/store';


export const getIntentList = ({mainStage, department}: any) => {
    department = department === 'interviewoverview' ? undefined : department
    const query = queryString.stringify({instanceId: store.getters.instanceId, mainStage, department})
    return request.get(`v1/intent?${query}`)
}

export const getRejectedIntentList = (department: any) => {
    department = department === 'interviewoverview' ? undefined : department
    const query = queryString.stringify({instanceId: store.getters.instanceId, department})
    return request.get(`v1/intent/rejected?${query}`)
}

export const assign = (data: any) => {
    return request.post(`v1/intent/assign`, data)
}

export const reject = (intentId: number) => {
    return request.post(`v1/intent/reject/${intentId}`)
}
