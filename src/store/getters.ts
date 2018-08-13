/*
 * @Author: Laphets 
 * @Date: 2018-07-12 10:44:04 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-08-13 14:11:55
 */

import { Getter, GetterTree } from 'vuex';
import { UserState } from '@/store/modules/interfaces/user.interface';
import { MyGetterTree } from '@/store/store.interface';
import { AppState } from '@/store/modules/interfaces/app.interface';

interface CombineState {
    user: UserState,
    app: AppState
}

export default {
    ZJUid: state => state.user.ZJUid,
    name: state => state.user.name,
    innerId: state => state.user.innerId,
    department: state => state.user.department,
    token: state => state.user.token,
    instancdId: state => state.app.instanceId,
    instanceName: state => state.app.instanceName
} as MyGetterTree<CombineState, any>
