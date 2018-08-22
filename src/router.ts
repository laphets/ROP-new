// modefied by ttfish on 8.16

import Vue, { AsyncComponent } from 'vue';
import Router, { RouteConfig } from 'vue-router';
// import Home from '@/layouts/index.vue';

Vue.use(Router);

const Layout: AsyncComponent = (): any => import('@/layouts/index.vue')
const Index: AsyncComponent = (): any => import('@/views/index.vue')
const Instance: AsyncComponent = (): any => import('@/views/instance.vue')
const Interview: AsyncComponent = (): any => import('@/views/interview/index.vue')
const Redirect: AsyncComponent = (): any => import('@/views/redirect.vue')
const CreateForm: AsyncComponent = (): any => import('@/views/createForm.vue')

export const constantRoutes: RouteConfig[] = [
    {
        path: '/login',
        name: 'redirect',
        component: Redirect,
    },
    {
        path: '',
        name: 'home',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'index',
                component: Index
            },
        ]
    },
    {
        path: '/console',
        name: 'console',
        component: Layout,
        children: [
            {
                path: 'instance',
                name: 'instance',
                component: Instance,
            },
            {
                path: 'interview',
                name: 'interview',
                component: Interview,
            },
            {
                path: 'createForm',
                name: 'createForm',
                component: CreateForm,
            },
        ]
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('./views/Home.vue'),
    },
]

const router: Router =  new Router({
    mode: 'history',
    routes: constantRoutes
});

export default router;
