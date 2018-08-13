import { DBFuction } from '@/utils/interfaces/db.interface';

export default {
    token: {
        set: (val) => {
            return window.localStorage.setItem('token', val)
        },
        get: () => {
            return window.localStorage.getItem('token')
        },
        remove: () => {
            return window.localStorage.removeItem('token')
        },
    } as DBFuction<string>,
    instanceName: {
        set: (val) => {
            return window.localStorage.setItem('instanceName', val)
        },
        get: () => {
            return window.localStorage.getItem('instanceName')
        },
        remove: () => {
            return window.localStorage.removeItem('instanceName')
        },
    } as DBFuction<string>,
    instanceId: {
        set: (val) => {
            return window.localStorage.setItem('instanceId', val)
        },
        get: () => {
            return window.localStorage.getItem('instanceId')
        },
        remove: () => {
            return window.localStorage.removeItem('instanceId')
        },
    } as DBFuction<string>,
}
