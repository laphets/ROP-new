import { Module } from "vuex";
import { constantRoutes, asyncRoutes } from '@/router';
import { getDepartmentList } from '@/api/association';
import { MyRouteConfig } from '@/interfaces/router.interface';
import { AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { RouterState } from '@/store/modules/interfaces/router.interface';


const router = {
    state: {
        routers: constantRoutes,
        generatedRouters: []
    },
    mutations: {
        SET_ROUTER: (state, routers: MyRouteConfig[]) => {
            state.generatedRouters = routers
            state.routers = [...state.routers, ...routers]
        }
    },
    actions: {
        async GenerateRouters({ commit, state }, departments) {
            const { data } = (await getDepartmentList()).data
            const { department } = data
            const Interview: AsyncComponent = (): any => import('@/views/interview/index.vue')
            
            const associationRouters = [] as RouteConfig[]
            department.forEach((item: string, index: number) => {
                associationRouters.push({
                    path: `view/department/${index}`,
                    name: item,
                    component: Interview,
                    meta: {
                        title: item
                    }
                })
            })
            
            asyncRoutes.forEach((item) => {
                if (item.path === '/interview') {
                    item.children = [...(item.children as RouteConfig[]), ...associationRouters]
                }
            })
            const generatedRouters = [...asyncRoutes, {
                path: '*',
                redirect: '/404'
            }]
            commit('SET_ROUTER', generatedRouters)
            return state.generatedRouters
        }
    }
} as Module<RouterState, any>

export default router
