<template>
    <div class="list-container">
        <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1400, y: 450 }" :loading="loading">
                <span slot="action" slot-scope="text, record">
                    <a @click="showInfo(record)" >查看信息</a>
                    <a-divider type="vertical" />                    
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                        一面分配 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay" @click="({key}) => onAssign(key, record)">
                        <a-menu-item>
                            <a href="javascript:;" key="auto">自动分配</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" key="manual">手动分配</a>
                        </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                    <a-divider type="vertical" />
                    <a-popconfirm
                    title="真的要拒绝这位面试者吗？"
                    @confirm="reject(record)"
                    okText="是"
                    cancelText="否"
                    >
                        <a class="error">拒绝</a>
                    </a-popconfirm>
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

        <a-modal
        title="加入一个场次"
        v-model="checkGroupVisible"
        :confirmLoading="submitLoading"
        @ok="handleJoinSubmit"
        okText="确认"
        cancelText="取消"
        >
            <a-form :autoFormCreate="(form)=>{this.form = form}">

                <a-form-item
                label='一面场次'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="target_interview_id"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择一个一面组别' }]}"
                >
                <a-select
                    placeholder='请选择一个一面场次以加入'
                >
                    <a-select-option v-for="(item, index) in availableGroup" :key="item.ID" :value='item.ID'>{{item.name}}</a-select-option>
                    <!-- <a-select-option :value='2'>测试报名表</a-select-option> -->
                </a-select>
                </a-form-item>
                
            </a-form>
        </a-modal>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// import { getIntentList, assign } from '@/api/intent'
import * as intentAPI from '@/api/intent'
import { successMessage } from '@/utils/message';

import { getInterviewList } from '@/api/interview'

@Component
export default class PublicSeaClass extends Vue {
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

    createGroupVisable = false

    columns = [
        { title: 'ID', width: 70, dataIndex: 'intent_id', key: 'id', fixed: 'left' },
        { title: '姓名', width: 120, dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: '学号', dataIndex: 'ZJUid', key: '2', width: 150 },
        { title: '一面分配状态', dataIndex: 'sub_stage_str', key: '5', width: 150 },
        { title: '面试组别', dataIndex: 'target_interview_str', key: '6', width: 150 },
        { title: '部门', dataIndex: 'department', key: '1', width: 150 },
        { title: '手机号', dataIndex: 'mobile', key: '3', width: 150 },
        { title: '邮箱', dataIndex: 'email', key: '4', width: 150 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 240,
            scopedSlots: { customRender: 'action' },
        },
    ];
    data: any = []
    loading = true
    async created() {
        const substage_map = ['未知', '未分配', '已分配未确认']
        this.data = ((await intentAPI.getIntentList({mainStage: 'Public Sea', department: this.$route.name})).data).data.map((item: any) => {
            let tmp_str = '';
            if (item.sub_stage === 1) {
                tmp_str = '未分配面试';
            } else {
                tmp_str = item.target_interview_id === 0 ? '自动分配,等待确认' : `${item.target_interview_id}`
            }
            return {
                ...item,
                sub_stage_str: substage_map[item.sub_stage],
                target_interview_str: tmp_str
            }
        })
        this.loading = false
    }

    checkGroupVisible = false
    availableGroup = []

    assign_mode = ""
    waitingIntents: any = [] 
    async onAssign(key: any, record: any) {
        this.waitingIntents = [record.intent_id]
        if (key === 'item_0') {
            this.assign_mode = "auto"
        } else if (key === "item_1") {
            this.assign_mode = "manual"
        }
        
        if (this.assign_mode === "auto") {
            try {
                await intentAPI.assign({assign_mode: this.assign_mode, intents: [record.intent_id]})
                successMessage(`操作成功~`)
            } catch (error) {
                
            }
        } else if (this.assign_mode === "manual") {
            this.availableGroup = ((await getInterviewList({
                interview_type: 1,
                auto_joinable: -1,
                department: record.department
            })).data).data
            this.checkGroupVisible = true
        }
    }

    submitLoading = false
    handleJoinSubmit(e: any) {
        (this as any).form.validateFields(async (err: boolean, values: any) => {
            if (!err) {
                this.submitLoading = true;
                try {
                    // console.log(values)
                    await intentAPI.assign({assign_mode: this.assign_mode, intents: this.waitingIntents, target_interview_id: values.target_interview_id})

                    this.submitLoading = false
                    this.checkGroupVisible = false
                    successMessage('面试分组创建成功~')
                } catch (error) {
                    this.submitLoading = false;
                }
            }
        })
    }

    reject(record: any) {
        intentAPI.reject(record.intent_id).then(res => {
            console.log(res)
            successMessage('拒绝面试者成功~')
        })
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