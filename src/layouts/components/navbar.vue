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
                <span class="menu-icon"><a-icon class="icon" type="search" /></span>
                <span class="menu-icon">
                    <!-- <a-badge dot class="item"> -->
                        <a-icon class="icon" type="bell" />
                    <!-- </a-badge> -->
                </span>
                </div>
                <a-dropdown>
                <div class="user-profile-body">
                    <img class="user-avatar" src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png">
                    <span class="user-name">{{department}}  {{innerId}}</span>
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


@Component
export default class NavbarClass extends Vue {
    @Getter('department') department!: string;
    @Getter('innerId') innerId!: string;
    @Getter('instanceName') instanceName!: string;

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
            window.location.href = `https://passport.zjuqsc.com/logout`
        }
    }

    mounted() {
        if (!this.instanceName) {
            showNotice('info', '尚未选择纳新实例', `请在"查看纳新"页面选择你所需要查看的纳新实例`)
        }
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
    .user-name {
      color: rgba(0,0,0,.65);
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
