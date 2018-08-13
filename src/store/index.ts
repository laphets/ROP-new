/*
 * @Author: Laphets 
 * @Date: 2018-07-13 13:50:10 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-07-14 22:51:42
 */

import Vue from 'vue';
import Vuex, { ModuleTree, Module } from 'vuex';

import user from '@/store/modules/user'

import { ModuleEntity } from '@/store/store.interface';

import getters from '@/store/getters'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
    } as ModuleEntity,
    getters,
});
