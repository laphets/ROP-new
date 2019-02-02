import router from '@/router';
import db from '@/utils/db';
import store from '@/store';

const whiteList = ['/login', '/404']

const HOST = process.env.VUE_APP_HOST as string

router.beforeEach(async (to, from, next) => {
    if (store.getters.ZJUid) {
        next()      
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
            return
        }
        if (db.token.get()) {
            try {
                await store.dispatch('GetUserInfo') 
                const generatedRoutes = await store.dispatch('GenerateRouters')
                router.addRoutes(generatedRoutes)
                console.log(to)
                next(to)
            } catch (error) {
                store.dispatch('Logout')
                window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=${HOST}${to.fullPath}`
            }
        } else {
            try {
                await store.dispatch('Login')
                await store.dispatch('GetUserInfo')
                const generatedRoutes = await store.dispatch('GenerateRouters')
                router.addRoutes(generatedRoutes)
                next(to)
            } catch (error) {
                // if (error.data.code === 10006) {
                    // window.location.href = `https://passport.zjuqsc.com/logout`
                // } else {
                    window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=${HOST}${to.fullPath}`
                // }
            }
        }
    }
})
