/*
 * @Author: Laphets 
 * @Date: 2018-07-12 10:44:04 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-07-15 11:15:22
 */

import { Getter, GetterTree } from 'vuex';
import { UserState } from '@/store/modules/interfaces/user.interface';
import { MyGetterTree } from '@/store/store.interface';

interface CombineState {
    user: UserState,
}

export default {
    ZJUid: state => state.user.ZJUid,
    name: state => state.user.name,
    innerId: state => state.user.innerId,
    department: state => state.user.department,
    token: state => state.user.token,
} as MyGetterTree<CombineState, any>
