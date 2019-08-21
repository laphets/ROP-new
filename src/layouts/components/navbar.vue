<template>
    <div class="navbar">
        <div class="left-bar-conatiner">
            <a-dropdown v-if="instanceName">
                <div style="cursor:default;">
                    <a-icon type="menu-unfold" />
                    {{instanceName}}
                </div>
                <a-menu slot="overlay" @click="instanceToogle">
                    <a-menu-item key="1">切换纳新实例</a-menu-item>
                    <a-menu-item key="2">退出当前纳新实例</a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>
        <div class="user-profile-container" trigger="click">
            <div class="user-profile-content">
                <div class="menu-icons">
                
                <span class="menu-icon message-icon" >
                <a-tooltip placement="bottom" >
                    <template slot="title">
                        <span>短信账户余额: ￥{{smsBalance}} <br> 预计发送量: {{parseInt(smsBalance/0.05)}}条</span>
                    </template>
                    <!-- <a-badge :numberStyle= "{backgroundColor: '#3d91f7'}" class="message-badge" :count="smsBalance/0.05" :overflowCount="999"> -->
                    <a-badge class="message-badge" :count="parseInt(smsBalance/0.05)" :overflowCount="2000">
                        <a-icon class="icon" type="message" />
                    </a-badge>
                </a-tooltip>
                </span>
                
                <!-- <span class="menu-icon"><a-icon class="icon" type="message" /></span> -->
                <span class="menu-icon">
                    <!-- <a-badge dot class="item"> -->
                        <a-icon class="icon" type="bell" />
                    <!-- </a-badge> -->
                </span>
                </div>
                <a-dropdown>
                <div class="user-profile-body">
                    <img v-if="avatar" class="user-avatar" :src="avatar">
                    <a-avatar v-else class="user-avatar-a" slot="avatar" :style="{backgroundColor: '#7265e6', verticalAlign: 'middle'}"> {{innerId? innerId[0] : name[0]}} </a-avatar>
                    <span class="user-name">{{department}}  {{innerId? innerId: name}}</span>
                    <a-tag class="user-type" :color=colorList[adminLevel]>{{typeList[adminLevel]}}</a-tag>
                </div>
                <a-menu class="user-dropdown" slot="overlay" @click="meToogle">
                    <a-menu-item key="1">
                        我的主页
                    </a-menu-item>
                    <a-menu-item key="2">
                        个人设置
                    </a-menu-item>
                    <a-menu-item key="3">
                        <span @click="" style="display:block;">退出</span>
                    </a-menu-item>
                </a-menu>
                </a-dropdown>
            </div>
            </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class'
import { errorMessage, successMessage, showNotice } from '@/utils/message';

const HOST = process.env.VUE_APP_HOST as string

@Component
export default class NavbarClass extends Vue {
    @Getter('department') department!: string;
    @Getter('innerId') innerId!: string;
    @Getter('name') name!: string;
    @Getter('adminLevel') adminLevel!: number;
    @Getter('instanceName') instanceName!: string;
    @Getter('avatar') avatar!: string;
    @Getter('smsBalance') smsBalance!: number;

    colorList = ['blue', 'orange', 'red']
    typeList = ['普通用户', '组织管理员', '全局管理员']

    created() {

    }

    instanceToogle({ key }: any) {
        if (key === '1') {
            this.$router.push({name: 'instance'})
        } else if (key === '2') {
            this.$store.dispatch('SetInstance', {instanceId: '', instanceName: ''})
            successMessage('成功退出当前实例~')
        }
    }

    meToogle({ key }: any) {
        if (key === '3') {
            this.$store.dispatch('Logout')
            window.location.href = `${HOST}/login`
        }
    }

    mounted() {
        if (!this.instanceName) {
            showNotice('info', '尚未选择纳新实例', `请在"查看纳新"页面选择你所需要查看的纳新实例`)
        }
        // showNotice('warning', '系统更新提示', `我们将于今日(Mar 3)下午对系统后台进行大规模更新，届时可能会出现短暂的响应延迟或无法完成数据请求或要求重新登录的现象,请各位潮人广而告之并且不要慌张😈`, 10)
    }
}
</script>

<style lang="less">
.ant-layout-header {
    line-height: 0px !important;
}
.left-bar-conatiner {
    // position: absolute;
    // left: 380px;
    font-size: 16px;
}
.navbar {
    background: #fff !important; 
    padding: 0px 20px 0px 30px;
    height: 64px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
      .user-profile-container {
    // position: absolute;
    // right: 20px;
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
    }
    .menu-icons {
      display: flex;
      align-items: center;
      .menu-icon {
        padding: 0 12px;
        // font-size: 18px !important;
        .icon {
            font-size: 17px !important;
          display: inline-block;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .message-icon {
        margin-right: 20px;
    }
    .user-avatar-a {
        margin: 0 6px 0 12px;
        width: 28px;
        height: 28px;
        line-height: 30px;
    }
    .ant-badge-count {
        right: -20px !important;
    }
    .user-name {
      color: rgba(0,0,0,.65);
    }
    .user-type {
        margin-left: 8px
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
</style>
