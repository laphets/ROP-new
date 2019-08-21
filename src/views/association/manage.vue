<template>
    <div class="association-page">
        <div class="container">
            <div class="opt-container">
                <a-button @click="showModal()">添加用户</a-button>
            </div>
            <a-skeleton active :loading="loading">
                <a-list
                    class="loadmore-list"
                    :loading="loading"
                    itemLayout="horizontal"
                    :dataSource="data"
                >
                    <!-- <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore" />
                    <a-button v-else @click="onLoadMore">loading more</a-button>
                    </div> -->
                    <a-list-item slot="renderItem" slot-scope="item, index">
                    <a slot="actions" @click="showPermissionModal(item)">更改权限</a>
                    <a slot="actions">管理</a>
                    <a slot="actions">更多</a>
                    <a-list-item-meta
                        :description="`${item.association_name}-${item.department} - Last Seen: ${get_relative_time(item.last_seen)}`"
                    >
                        <a slot="title" href="#">
                            {{item.inner_id ? item.inner_id : item.name}}
                            <a-tag class="user-type" :color=tagColorList[item.admin_level]>{{typeList[item.admin_level]}}</a-tag>
                        </a>                     
                            <a-avatar v-if="!item.avatar" slot="avatar" :style="{backgroundColor: colorList[index % colorList.length], verticalAlign: 'middle'}"> {{item.inner_id ? item.inner_id[0] : item.name[0]}} </a-avatar>
                            <a-avatar v-else slot="avatar" :src="item.avatar" :style="{ verticalAlign: 'middle'}"> </a-avatar>
                    </a-list-item-meta>
                    <div>提醒面试</div>
                    </a-list-item>
                </a-list>
            </a-skeleton>
            <AdduserModal
                ref="collectionForm"
                :visible="visible"
                @cancel="handleCancel"
                @create="handleCreate"
            />
            <a-modal
                :visible="permissionEditVisible"
                :title="`修改${editedUser.inner_id ? editedUser.inner_id : editedUser.name}的权限`"
                @cancel="permissionEditCancel"
                @ok="permissionEditOk"
            >
                <a-radio-group v-model="editedUser.admin_level">
                    <a-radio :value='2'>全局管理员</a-radio>
                    <a-radio :value='1'>组织管理员</a-radio>
                    <a-radio :value='0'>普通用户</a-radio>
                </a-radio-group>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getUserList, addUser, updatePermission } from '@/api/association';

import moment from 'moment';
import 'moment/locale/zh-cn';

import AdduserModal from './components/adduser.vue'

import { successMessage, errorMessage } from '@/utils/message';

@Component({
    components: {
        AdduserModal
    }
})
export default class AssociationManagePageClass extends Vue {
    loading = true;
    data = [];
    colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
    loadingMore = false;
    showLoadingMore = true;
    visible = false;
    tagColorList = ['blue', 'orange', 'red']
    typeList = ['普通用户', '组织管理员', '全局管理员']
    permissionEditVisible = false
    editedUser = {}

    get_relative_time(time: string) {
        return time === '0001-01-01T00:00:00Z' ? '很久以前' : moment(new Date(time)).fromNow()
    }

    async created() {
        const { data } = (await getUserList()).data
        this.loading = false;
        this.data = data;
    }

    async initData() {
        const { data } = (await getUserList()).data
        this.data = data;
    }

    showModal() {
        this.visible = true;
    }
    handleCancel() {
        this.visible = false;
    }
    handleCreate() {
        const form = (this.$refs.collectionForm as any).form;
        form.validateFields(async (err: any, values: any) => {
            if (err) {
                return;
            }

            try {
                const data = await addUser(values)
                this.initData()
                successMessage('用户创建成功')
                form.resetFields();
                this.visible = false;
            } catch (error) {
                errorMessage('用户创建失败')
                return
            }
        });
    }

    showPermissionModal(item: any) {
        this.editedUser = item
        this.permissionEditVisible = true
    }

    permissionEditCancel() {
        this.permissionEditVisible = false
    }

    async permissionEditOk() {
        try {
            const { id, admin_level } = (this.editedUser as any)
            await updatePermission({user_id: id, admin_level: admin_level})
            this.permissionEditVisible = false
            successMessage('修改成功')
            this.initData()
        } catch (error) {
            errorMessage('修改失败')
            return
        }
    }
}
</script>

<style lang="less" scoped>
.association-page {
    height: calc(100vh - 70px);
    padding: 20px;
    .container {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
        border-radius: 4px;
        padding: 28px 36px 10px 36px;
        .loadmore-list {
            min-height: 350px;
        }
    }
}
</style>
