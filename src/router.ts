// modefied by ttfish on 8.16

import Vue, { AsyncComponent } from 'vue';
import Router, { RouteConfig } from 'vue-router';
import { MyRouteConfig } from '@/interfaces/router.interface';
// import Home from '@/layouts/index.vue';

const Page404: AsyncComponent = (): any => import('@/views/404.vue')
const Redirect: AsyncComponent = (): any => import('@/views/redirect.vue')


Vue.use(Router);

const Layout: AsyncComponent = (): any => import('@/layouts/index.vue')
const Index: AsyncComponent = (): any => import('@/views/index.vue')
const Instance: AsyncComponent = (): any => import('@/views/instance.vue')
const User: AsyncComponent = (): any => import('@/views/user.vue')
const Interview: AsyncComponent = (): any => import('@/views/interview/index.vue')
const CreateForm: AsyncComponent = (): any => import('@/views/createForm.vue')
const AssociationView: AsyncComponent = (): any => import('@/views/association/view.vue')
const AssociationManage: AsyncComponent = (): any => import('@/views/association/manage.vue')


export const constantRoutes: MyRouteConfig[] = [
    {
        path: '/login',
        name: 'redirect',
        component: Redirect,
        hidden: true
    },
    {
        path: '/404',
        name: '404',
        component: Page404,
        hidden: true
    },
]

export const asyncRoutes: MyRouteConfig[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        name: 'indexroot',
        meta: {
            title: '首页',
        },
        children: [
            {
                path: 'index',
                component: Index,
                name: 'index',
                meta: {
                    title: '首页',
                    icon: 'home'
                }
            }
        ]
    },
    {
        path: '/instance',
        component: Layout,
        redirect: '/instance/view',
        name: 'instance',
        meta: {
            title: '纳新实例',
        },
        children: [
            {
                path: 'view',
                name: 'instanceoverview',
                component: Instance,
                meta: {
                    title: '查看纳新',
                    icon: 'compass'
                }
            },
        ]
    },
    {
        path: '/association',
        component: Layout,
        redirect: '/association/view',
        name: 'association',
        meta: {
            title: '组织管理',
            icon: 'team'
        },
        children: [
            {
                path: 'view',
                name: 'viewassociation',
                component: AssociationView,
                meta: {
                    title: '查看组织',
                    icon: 'solution'
                }
            },
            {
                path: 'manage',
                name: 'manageassociation',
                component: AssociationManage,
                meta: {
                    title: '成员管理',
                    icon: 'fork'
                }
            },
        ]
    },
    {
        path: '/interview',
        component: Layout,
        redirect: '/interview/view/all',
        name: 'interview',
        meta: {
            title: '纳新面试',
            icon: 'profile'
        },
        children: [
            {
                path: 'view/all',
                name: 'interviewoverview',
                component: Interview,
                meta: {
                    title: '名单总览'
                }
            },
        ]
    },
    {
        path: '/form',
        component: Layout,
        name: 'form',
        redirect: '/form/create',
        meta: {
            title: '纳新表单'
        },
        children: [
            {
                path: 'create',
                name: 'createForm',
                component: CreateForm,
                meta: {
                    title: '新建表单',
                    icon: 'form'
                }
            },
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user/view',
        name: 'user',
        meta: {
            title: '个人信息',
        },
        children: [
            {
                path: 'view',
                name: 'userview',
                component: User,
                meta: {
                    title: '个人信息',
                    icon: 'user'
                }
            },
        ]
    },
]

const router: Router =  new Router({
    mode: 'history',
    base: '/console/',
    routes: constantRoutes
});

export default router;
