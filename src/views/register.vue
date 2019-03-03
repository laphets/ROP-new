<template>
    <div class="register-page">
        <div class="main">
            <div class="desc-container">
                <h1 v-if="!error">{{data.association.name}}纳新</h1>
                <h1 v-else>链接已经失效</h1>
                <!-- <h1>求是潮纳新开放平台</h1> -->
                <div v-if="!error" class="desc">
                    {{data.name}}同学您好，接下来请为您的账户设置密码并填写相关信息
                </div>
            </div>
            <div v-if="!error" class="form-container">
                <a-form
                    id="components-form-demo-normal-login"
                    :form="form"
                    class="login-form"
                    @submit="handleSubmit"
                >
                <a-form-item>
                    <a-input
                        v-decorator="[
                        'password',
                        { rules: [{ required: true, message: '请创建一个密码' }] }
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
                        <a-select
                            placeholder="部门选择"
                            v-decorator="[
                            'department',
                            {
                                rules: [{ required: true, message: '请选择您所在的部门' }],
                            }
                            ]">
                            <a-select-option v-for="(item, index) in departmentList" :key="index" :value="item">
                            {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="login-form-button"
                    >
                        注册
                    </a-button>
                    </a-form-item>
                </a-form>
            </div>

        </div>
        <footer>
            <div class="qsc">
                求是潮纳新开放平台(ROP) Beta
            </div>
            <div class="about">
                ©2019 浙江大学求是潮 All rights reserved.
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getInfo, register } from '@/api/register'
import { loginByPasswd } from '@/api/user'
import { successMessage, errorMessage } from '@/utils/message';

import db from '@/utils/db';

const HOST = process.env.VUE_APP_HOST as string

@Component
export default class RedirectPageClass extends Vue {
    data = {
        name: '',
        association: {
            name: ''
        }
    }
    error = false
    departmentList = []
    // form = {}
    beforeCreate() {
        (this as any).form = this.$form.createForm(this);
    }
    async created() {
        try {
            const { data } = (await getInfo(this.$route.query.uid as string)).data
            this.data = data
            this.departmentList = (this.data as any).association.department_list.split('&')
        } catch (error) {
            this.error = true
        }
    }

    handleSubmit(e: any) {
      e.preventDefault();
      (this as any).form.validateFields(async (err: any, values: any) => {
        if (!err) {
            try {
                const { data } = (await register({
                    uid: this.$route.query.uid,
                    ...values,
                })).data
                successMessage('用户注册成功')
                db.token.set(`Bearer ${data}`)
                window.location.href = `${HOST}/index`
                // this.$router.push('/index')
            } catch (error) {
                errorMessage('用户注册失败')
            }
        }
      });
    }
}
</script>

<style lang="less" scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.register-page {
    height: 100vh;
    font-family: Open Sans,sans-serif;
    position: relative;
    .main {
        padding: 0px 30px;
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
            padding: 10px 0px;
            width: 100%;
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
        padding: 28px 30px;
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
