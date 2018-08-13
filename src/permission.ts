import router from '@/router';
import db from '@/utils/db';
import store from '@/store';

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    if (store.getters.ZJUid) {
        next()        
    } else {
        if (db.token.get()) {
            try {
                await store.dispatch('GetUserInfo') 
                next()
            } catch (error) {
                store.dispatch('Logout')
                window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=http://dev.rop.zjuqsc.com${to.fullPath}`
            }
        } else {
            try {
                await store.dispatch('Login')
                await store.dispatch('GetUserInfo')
                next()
            } catch (error) {
                if (error.data.code === 10006) {
                    window.location.href = `https://passport.zjuqsc.com/logout`
                } else {
                    window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=http://dev.rop.zjuqsc.com${to.fullPath}`
                }
            }
        }
    }
})
