<template>
    <div class="list-container">
        <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1400, y: 450 }">
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
                    <a>拒绝</a>
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
                    {{item.value}}
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
import { getIntentList, assign } from '@/api/intent'
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

    createGroupVisable=false

    columns = [
        { title: 'ID', width: 70, dataIndex: 'intent_id', key: 'id', fixed: 'left' },
        { title: '姓名', width: 120, dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: '部门', dataIndex: 'department', key: '1', width: 150 },
        { title: '学号', dataIndex: 'ZJUid', key: '2', width: 150 },
        { title: '手机号', dataIndex: 'mobile', key: '3', width: 150 },
        { title: '邮箱', dataIndex: 'email', key: '4', width: 150 },
        { title: '分配状态', dataIndex: 'sub_stage', key: '5', width: 150 },
        { title: '分配组别', dataIndex: 'target_interview_id', key: '6', width: 150 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 240,
            scopedSlots: { customRender: 'action' },
        },
    ];
    data: any = []
    async created() {
        this.data = ((await getIntentList({mainStage: 'Public Sea', department: this.$route.name})).data).data
    }

    checkGroupVisible = false
    availableGroup = []

    assign_mode = ""
    waitingIntents: any = [] 
    async onAssign(key: any, record : any) {
        this.waitingIntents = [record.intent_id]
        if (key == 'item_0')
            this.assign_mode = "auto"
        else if (key == "item_1")
            this.assign_mode = "manual"
        
        if (this.assign_mode == "auto") {
            try {
                await assign({assign_mode: this.assign_mode, intents: [record.intent_id]})
                successMessage(`操作成功~`)
            } catch (error) {
                
            }
        } else if (this.assign_mode == "manual") {
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
                    await assign({assign_mode: this.assign_mode, intents: this.waitingIntents, target_interview_id: values.target_interview_id})

                    this.submitLoading = false
                    this.checkGroupVisible = false
                    successMessage('面试分组创建成功~')
                } catch (error) {
                    this.submitLoading = false;
                }
            }
        })
    }
}
</script>
<style lang="less" scoped>
.list-container {
    margin-top: 25px;
}
</style>