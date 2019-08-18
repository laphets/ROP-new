<template>
    <div class="list-container">
        <a-table :columns="columns" :dataSource="data" :scroll="{ x: 800, y: 450 }" :loading="loading">
                <span slot="action" slot-scope="text, record">
                    <a @click="showInfo(record)" >查看信息</a>
                </span>
        </a-table>

        <a-modal
        :title="`${modal_content.name}的个人信息`"
        v-model="modalVisable"
        @ok="() => this.modalVisable=false"
        :width="1000"
        >
            <div>
                <div v-for="(item, index) in modal_content.other_info" :key="index">
                    <strong>{{item.key}}: </strong>
                    <span v-if="item.value!==modal_content.photo">{{item.value}}</span>
                    <a-popover v-else :title="`${modal_content.name}的照片`">
                        <template slot="content">
                            <img style="width: 300px;" :src="modal_content.photo"/>
                        </template>
                        <a-tag color="cyan">查看照片</a-tag>
                    </a-popover>
                </div>
                
            </div>
        </a-modal>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as intentAPI from '@/api/intent'

@Component
export default class RejectBinClass extends Vue {
    @Prop({default: 'card'}) showmode!: string
    get showMode() {
        return this.showmode
    }
    set showMode(newvalue: string) {
        this.$emit('update:showmode', newvalue)
    }
    
    modal_content = {}
    modalVisable = false
    showInfo(record: any) {
        this.modal_content = {
            ...record,
            other_info: JSON.parse(record.other_info) 
        }
        this.modalVisable = true
    }

    columns = [
        { title: '编号', width: 70, dataIndex: 'intent_id', key: 'id', fixed: 'left' },
        { title: '姓名', width: 120, dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: '学号', dataIndex: 'ZJUid', key: '2', width: 150 },
        { title: '部门', dataIndex: 'department', key: '1', width: 150 },
        { title: '手机号', dataIndex: 'mobile', key: '3', width: 150 },
        { title: '邮箱', dataIndex: 'email', key: '4', width: 150 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            scopedSlots: { customRender: 'action' },
        },
    ];
    data: any = []
    loading = true
    async created() {
        this.data = ((await intentAPI.getRejectedIntentList(this.$route.name)).data).data.map((item: any) => {
            return {
                ...item,
            }
        })
        this.loading = false
    }

}
</script>
<style lang="less" scoped>
.error {
    color: red;
}
.list-container {
    margin-top: 25px;
}
</style>