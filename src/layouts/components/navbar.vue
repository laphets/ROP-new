<template>
    <div class="navbar">
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
                    <span class="user-name">求是潮</span>
                </div>
                <a-menu class="user-dropdown" slot="overlay">
                    <a-menu-item>
                        我的主页
                    </a-menu-item>
                    <a-menu-item>
                        个人设置
                    </a-menu-item>
                    <a-menu-item>
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
@Component
export default class NavbarClass extends Vue {

}
</script>

<style lang="less">
.ant-layout-header {
    line-height: 0px !important;
}

.navbar {
    background: #fff !important; 
    padding: 0;
    height: 64px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
      .user-profile-container {
    position: absolute;
    right: 20px;
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
