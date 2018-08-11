import {Store, Module, Mutation, MutationTree, ActionTree} from 'vuex';
import { UserState } from '@/store/modules/interfaces/user.interface';
import db from '@/utils/db';
import { login } from '@/api/user';

export default {
    state: {
        ZJUid: '',
        name: '',
        innerId: '',
        department: '',
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
        },
    },
    actions: {
        async Login({ commit }): Promise<any> {
            try {
                const { data } = await login()
                commit('SET_TOKEN', `Bearer ${data.data}`)
                return
            } catch (error) {
                return Promise.reject(error)
            }
        },
        Logout({ commit }) {
            commit('SET_TOKEN', '')
            db.token.remove()
        }
    }
} as Module<UserState, any>
