import {Store, Module, Mutation, MutationTree, ActionTree} from 'vuex';
import { UserState } from '@/store/modules/interfaces/user.interface';
import db from '@/utils/db';
import { loginByQSC, getUserInfo, getSMSInfo } from '@/api/user';

export default {
    state: {
        userId: 0,
        ZJUid: '',
        name: '',
        innerId: '',
        association_id: 0,
        association_name: '',
        admin_level: 0,
        department: '',
        avatar: '',
        token: db.token.get(),
        smsBalance: 0,
        departmentList: '',
    },
    mutations: {
        SET_USERID: (state, userId) => {
            state.userId = userId
        },
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
        },
        SET_SMSBALANCE: (state, balance) => {
            state.smsBalance = balance;
        },
        SET_DEPARTMENTLIST: (state, list) => {
            state.departmentList = list;
        },
        SET_ASSOCIATIONID: (state, id) => {
            state.association_id = id;
        },
        SET_ASSOCIATIONNAME: (state, name) => {
            state.association_name = name;
        },
        SET_ADMINLEVEL: (state, level) => {
            state.admin_level = level;
        }
    },
    actions: {
        async Login({ commit }): Promise<any> {
            try {
                const { data } = await loginByQSC()
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
                const { ZJUid, name, inner_id, department, avatar, id, association, admin_level } = ((await getUserInfo()).data).data
                const { data: SMSRes } = await getSMSInfo()
                commit('SET_USERID', id)
                commit('SET_ZJUID', ZJUid)
                commit('SET_NAME', name)
                commit('SET_INNERID', inner_id)
                commit('SET_DEPARTMENT', department)
                commit('SET_AVATAR', avatar)
                commit('SET_SMSBALANCE', SMSRes.data.balance)
                commit('SET_DEPARTMENTLIST', association.department_list)
                commit('SET_ASSOCIATIONID', association.ID)
                commit('SET_ASSOCIATIONNAME', association.name)
                commit('SET_ADMINLEVEL', admin_level)

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
