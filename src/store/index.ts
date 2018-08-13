/*
 * @Author: Laphets 
 * @Date: 2018-07-13 13:50:10 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-08-13 14:18:57
 */

import Vue from 'vue';
import Vuex, { ModuleTree, Module } from 'vuex';

import user from '@/store/modules/user'
import app from '@/store/modules/app'

import { ModuleEntity } from '@/store/store.interface';

import getters from '@/store/getters'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        app
    } as ModuleEntity,
    getters,
});
