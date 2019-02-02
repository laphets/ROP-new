<template>
    <div class="sidebar">
        <div class="logo">
            <span class="site-name">求是潮纳新开放系统</span>
        </div>

        <a-menu
            style="width: 256px"
            mode="inline"
            :defaultSelectedKeys="['index']"
            theme="dark"
        >
                <template v-for="(item, index) in routes" v-if="!item.hidden&&item.children">
                    <a-menu-item v-if="hasOneShowingChildren(item.children)"  :key="item.children[0].name">
                        <router-link :to="item.path !== '/' ? item.path : '' + '/' + item.children[0].path">
                            <a-icon :type="item.children[0].meta.icon" />{{item.children[0].meta.title}}
                        </router-link>
                    </a-menu-item>

                    <a-sub-menu v-else :key="item.name">
                        <span slot="title"><a-icon :type="item.meta.icon" /><span>{{item.meta.title}}</span></span>

                        <a-menu-item v-for="child in item.children" v-if="!child.hidden" :key="child.name">
                            <router-link :to="item.path+'/'+child.path" >
                                {{child.meta.title}}
                            </router-link>
                        </a-menu-item>

                    </a-sub-menu>
                </template>
        


            <!-- <sidebar-item :routes="routers"></sidebar-item> -->
            <!-- <router-link :to="{name: 'index'}">
                <a-menu-item key="1">
                    <a-icon type="home" />
                    首页
                </a-menu-item>
            </router-link>

            <a-menu-item key="2">
                <router-link :to="{name: 'instance'}">
                    <a-icon type="compass" />
                    纳新管理
                </router-link>
            </a-menu-item>

            <a-menu-item key="20">
                <a-icon type="profile" />
                名单总览
            </a-menu-item>

            <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="dashboard" /><span>部门</span></span>
                <a-menu-item key="3">
                    <router-link :to="{name: 'interview'}">
                        人力资源部
                    </router-link>
                </a-menu-item>
                <a-menu-item key="4">推广中心</a-menu-item>
                <a-sub-menu key="sub1-2" title="技术研发部门">
                    <a-menu-item key="5">一面</a-menu-item>
                    <a-menu-item key="6">二面</a-menu-item>
                </a-sub-menu>
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <span slot="title"><a-icon type="setting" /><span>设置</span></span>
                <a-menu-item key="7">Option 7</a-menu-item>
                <a-menu-item key="8">Option 8</a-menu-item>
                <a-menu-item key="9">Option 9</a-menu-item>
                <a-menu-item key="10">Option 10</a-menu-item>
            </a-sub-menu>
            <a-divider></a-divider>
            <a-menu-item key="39">
                <router-link :to="{name: 'createForm'}">
                    <a-icon type="link" />
                    链接测试
                </router-link>
            </a-menu-item>
            <a-menu-item key="19">
                <router-link :to="{name: 'createForm'}">
                    <a-icon type="form" />
                    表单设计
                </router-link>
            </a-menu-item>
            <a-menu-item key="17">
                <a-icon type="delete" />
                回收站
            </a-menu-item>
            <a-menu-item key="23">
                <a-icon type="rocket" />
                更新日志
            </a-menu-item> -->
        </a-menu>
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { MyRouteConfig } from '@/interfaces/router.interface';
// import SidebarItem from './sidebarItem.vue'

@Component
export default class SidebarClass extends Vue {
    @Getter('routers') routes!: MyRouteConfig[]

    created() {
        // console.log(this.routers)
        // console.log('11',this.routes)
    }

    hasOneShowingChildren(children: MyRouteConfig[]): boolean {
        // console.log(children)
        const showingChildren = children.filter((item) => {
            return !item.hidden
        })
        // console.log(showingChildren)
        if (showingChildren.length === 1) {
            return true
        }
        return false
    }
}
</script>

<style lang="less">
.sidebar {
    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 61px;
        line-height: 28px;
        background: #4A90E2;
        color: #fff;
        text-align: center;
        font-size: 20px;
        font-weight: 250;
        overflow: hidden;
        margin: 5px;
    }
    .ant-menu {
        background: #4A90E2 !important;
        // color: #fff !important;
        font-weight: 200 !important;
    }
    .ant-menu-item {
        background: #4A90E2 !important;

    }
    .ant-menu-item-selected {
        background: #AAC9F7 !important;
    }
    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
        -webkit-box-shadow: 0 0px 0px rgba(0, 0, 0, 0.45) inset !important ;
        box-shadow: 0 0px 0px rgba(0, 0, 0, 0.45) inset !important;
    }
    overflow: auto !important;
    color: #fff !important;
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    transition: width 0.28s;
    width: 256px !important;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    overflow: hidden;
    background-color: #4A90E2;
    .ant-divider {
        background: rgba(255,255,255,0.5);   
        margin: 12px;     
    }
}

</style>
