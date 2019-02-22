import {Store, Module, Mutation, MutationTree, ActionTree} from 'vuex';
import { UserState } from '@/store/modules/interfaces/user.interface';
import db from '@/utils/db';
import { login, getUserInfo, getSMSInfo } from '@/api/user';

export default {
    state: {
        ZJUid: '',
        name: '',
        innerId: '',
        department: '',
        avatar: '',
        token: db.token.get()
    },
    mutations: {
        SET_ZJUID: (state, ZJUid) => {
            state.ZJUid = ZJUid
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_INNERID: (state, innerId) => {
            state.innerId = innerId
        },
        SET_DEPARTMENT: (state, department) => {
            state.department = department
        },
        SET_TOKEN: (state, token) => {
            state.token = token
            db.token.set(token)
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        }
    },
    actions: {
        async Login({ commit }): Promise<any> {
            try {
                const { data } = await login()
                console.log(data)
                commit('SET_TOKEN', `Bearer ${data.data}`)
                return
            } catch (error) {
                return Promise.reject(error)
            }
        },
        Logout({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_INSTANCE', {instanceId: '', instanceName: ''})
            db.token.remove()
            db.instanceId.remove()
            db.instanceName.remove()
        },
        async GetUserInfo({ commit, state }) {
            try {
                const { ZJUid, name, inner_id, department, avatar } = ((await getUserInfo()).data).data
                const SMSRes = await getSMSInfo()
                console.log(SMSRes)
                commit('SET_ZJUID', ZJUid)
                commit('SET_NAME', name)
                commit('SET_INNERID', inner_id)
                commit('SET_DEPARTMENT', department)
                commit('SET_AVATAR', avatar)
                return { ZJUid, name, inner_id, department }
            } catch (error) {
                return Promise.reject(error)
            }
        },
        SetAvatar({ commit }, { avatar }) {
            commit('SET_AVATAR', avatar)
        }
    }
} as Module<UserState, any>
