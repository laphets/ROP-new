<template>
    <!-- <div class="loading-container">
        <a-spin class="loading">
        <a-icon slot="indicator" type="loading" style="font-size: 27px" spin />
        </a-spin>
        登录状态验证中...
    </div> -->
    <div class="login-page">
        <div class="main">
            <div class="desc-container">
                <h1>求是潮纳新开放平台</h1>
                <div class="desc">
                    所有纳新问题一站式解决，随时随地自由创建纳新表单开始纳新
                </div>
            </div>
            <div class="form-container">
                <a-form
                    id="components-form-demo-normal-login"
                    :form="form"
                    class="login-form"
                    @submit="handleSubmit"
                >

                    <a-form-item>
                        <a-select
                            placeholder="组织选择"
                            v-decorator="[
                            'association_id',
                            {
                                rules: [{ required: true, message: '请选择您所在的组织' }],
                            }
                            ]">
                            <a-select-option v-for="(item, index) in associationList" :key="index" :value="item.ID">
                            {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item>
                    <a-input
                        v-decorator="[
                        'ZJUid',
                        { rules: [{ required: true, message: '请输入你的学号' }] }
                        ]"
                        placeholder="学号"
                    >
                        <a-icon
                        slot="prefix"
                        type="user"
                        style="color: rgba(0,0,0,.25)"
                        />
                    </a-input>
                    </a-form-item>
                    <a-form-item>
                    <a-input
                        v-decorator="[
                        'password',
                        { rules: [{ required: true, message: '请输入你的密码' }] }
                        ]"
                        type="password"
                        placeholder="密码"
                    >
                        <a-icon
                        slot="prefix"
                        type="lock"
                        style="color: rgba(0,0,0,.25)"
                        />
                    </a-input>
                    </a-form-item>
                    <a-form-item>
                    <a-checkbox
                        v-decorator="[
                        'remember',
                        {
                            valuePropName: 'checked',
                            initialValue: true,
                        }
                        ]"
                    >
                        记住登录状态
                    </a-checkbox>
                    <a
                        class="login-form-forgot"
                        href=""
                    >
                        忘记密码
                    </a>
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="login-form-button"
                    >
                        登录
                    </a-button>
                    </a-form-item>
                </a-form>
            </div>

            <div class="hr">
            </div>

            <div class="method-container">
                <a @click="passportLogin()">求是潮Passport登录</a>
            </div>

        </div>
        <footer>
            <div class="qsc">
                求是潮纳新开放平台(ROP) Beta
            </div>
            <div class="about">
                © 2003-2019 浙江大学求是潮 All rights reserved.
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { loginByPasswd, getAssociation, loginByQSC } from '@/api/user'
import { successMessage, errorMessage } from '@/utils/message';
import db from '@/utils/db';
import store from '@/store';

const HOST = process.env.VUE_APP_HOST as string

@Component
export default class LoginPageClass extends Vue {
    associationList = []
    redirect = ""
    async created() {
        if (db.token.get()) {
            try {
                await store.dispatch('GetUserInfo') 
                window.location.href = `${HOST}/index`
            } catch (error) {
                
            }
        }
        const { data } = (await getAssociation()).data
        this.associationList = data;
        this.redirect = this.$route.query.redirect as string
        // console.log('233')
    }

    beforeCreate() {
        (this as any).form = this.$form.createForm(this);
    }

    handleSubmit(e: any) {
      e.preventDefault();
      (this as any).form.validateFields(async (err: any, values: any) => {
        if (!err) {
            try {
                const { data } = (await loginByPasswd({
                    ...values,
                })).data
                db.token.set(`Bearer ${data}`)
                successMessage('用户登录成功')
                this.$router.push(this.redirect ? this.redirect : '/index')
            } catch (error) {
                // errorMessage('用户登录失败')
            }
        }
      });
    }

    async passportLogin() {
        try {
            await store.dispatch('Login')
            this.$router.push(this.redirect ? this.redirect : '/index')
        } catch (error) {
            // window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=${HOST}${this.redirect ? this.redirect : ''}`
            window.location.href = `https://passport.zjuqsc.com/login?type=new&redirect=${HOST}${'/redirect'}`
            // if (error.data.code === 10006) {
            //     window.location.href = `https://passport.zjuqsc.com/logout`
            // } else {
                
            // }
        }
    }
}
</script>

<style lang="less" scoped>
.ant-form-item {
    margin-bottom: 5px !important;
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.login-page {
    height: 100vh;
    font-family: Open Sans,sans-serif;
    position: relative;
    .main {
        font-family: Helvetica Neue,Helvetica,Arial,sans-serif;

        width: 100%;
        height: calc(100vh - 90px);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .desc-container {
            max-width: 400px;
            h1 {
                font-weight: 600;
                font-size: 28px;
                margin-bottom: 0.2em;
            }
            .desc {
                color: #777;
                font-weight: 300;
                font-size: 1.42857em;
            }
        }
        .form-container {
            padding: 10px 40px;
            width: 480px;
        }
        .hr {
            width: 380px;
            background: #ddd;
            height: 1px;
            margin: 2em 0;
            margin: 2em 0 2em -1rem;
            text-align: left;
            font-size: 14px;
            line-height: 1.42857143;
            color: #333;
        }
        .method-container {
            a {
                background: #548;
                border-radius: 2px;
                color: #fff;
                display: block;
                height: 40px;
                line-height: 40px;
                margin: 1em 0;
                min-width: 200px;
                padding: 0 1em 0 2em;
                text-align: left;
                width: 200px;
                font-size: 16px;
                font-weight: 300;
                touch-action: manipulation;
                font-family: Open Sans,sans-serif;
            }
        }


    }
    footer {
        text-align: right;
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 88px;
        padding: 28px 50px;
        background: rgba(0,0,0,.1);
        .qsc {
            font-weight: 700;
            font-size: 15px;
        }
    }
}
.loading-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    .loading {
        margin-right: 20px;
    }
}
</style>
