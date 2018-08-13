/*
 * @Author: Laphets
 * @Date: 2018-07-13 14:01:33
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-08-13 14:17:53
 */

import { Module } from 'vuex';
import { AppState } from '@/store/modules/interfaces/app.interface';
import db from '@/utils/db';

export default {
    state : {
        instanceId: db.instanceId.get(),
        instanceName: db.instanceName.get(),
    },
    mutations : {
        SET_INSTANCE: (state, { instanceId, instanceName }) => {
            state.instanceId = instanceId
            state.instanceName = instanceName
            db.instanceId.set(instanceId)
            db.instanceName.set(instanceName)
        }
    },
    actions : {
        SetInstance({ commit }, { instanceId, instanceName }) {
            commit('SET_INSTANCE', { instanceId, instanceName })
        }
    }
} as Module<AppState, any>
