<template>
    <div class="menu-wrapper">
        <div v-for="(item, index) in routes" v-if="!item.hidden&&item.children">
            <a-menu-item v-if="hasOneShowingChildren(item.children)"  :key="item.children[0].name">
                <router-link :to="item.path + '/' + item.children[0].path">
                    <a-icon type="compass" />
                    {{item.children[0].meta.title}}
                </router-link>
            </a-menu-item>

            <a-sub-menu v-else :key="item.name">
                <span slot="title"><a-icon type="dashboard" /><span>{{item.meta.title}}</span></span>

                <a-menu-item v-for="child in item.child" v-if="!child.hidden" :key="child.name">
                    <router-link :to="item.path+'/'+child.path" >
                        {{child.meta.title}}
                    </router-link>
                </a-menu-item>

            </a-sub-menu>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { MyRouteConfig } from '@/interfaces/router.interface';


@Component
export default class SidebarItemClass extends Vue {
    @Prop(Array) routes!: MyRouteConfig[]
    
    created() {
        console.log(this.routes)
    }

    hasOneShowingChildren(children: MyRouteConfig[]): boolean {
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
</style>
