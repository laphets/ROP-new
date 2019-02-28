<template>
    <div>
        <div v-if="showMode === 'card'" class="card-container">
            <a-row :gutter="16">
                <a-col v-for="(item, index) in interviewList" :key="item.ID" :span="8"
                :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                    <div
                    class="card"
                    hoverable
                    :bodyStyle="{padding: '18px'}"
                    >
                    <div class="main">
                        <a-card-meta
                            :title="`${item.name}${item.auto_joinable==1 ? '' : '  (保留场次)'} ${item.not_available == 1 ? '(停用)' : ''}`"
                        >
                        </a-card-meta>
                        <div class="card-body">
                            <div class="first">编号: &nbsp&nbsp&nbsp {{item.ID}}</div>
                            <div>部门: &nbsp&nbsp&nbsp  {{item.department}}</div>
                            <div>主面试官: &nbsp&nbsp&nbsp {{item.director}}</div>
                            <div>时间: &nbsp&nbsp&nbsp <a-icon type="clock-circle-o" />&nbsp{{prase_time(item.start_time)}} </div>
                            <div class="status">
                                <div>
                                    <a-badge :status="item.status === 'cur'? 'processing': (item.status === 'before'? 'error': 'success')" /> {{parse_status(item.status)}}
                                    <span class="update-at"> · <span v-for="(intent) in item.participants" :key="intent.ID"> {{intent.name}} </span></span>
                                </div>
                                <div v-if="item.participants.length" class="avatar">
                                    <a-avatar class="avatar" v-for="(item1, index) in item.participants" :key="index" @click.native="showInfo(item1)" :style="{backgroundColor: colorList[index % colorList.length], verticalAlign: 'middle'}"> {{item1.name[0]}} </a-avatar>
                                </div>
                                <div v-else>
                                    暂无面试者
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <ul class="ant-card-actions" slot="actions">
                        <li style="width: 33.3333%;">面试者查看</li>
                        <li style="width: 33.3333%;">
                            <a-dropdown placement="bottomCenter">
                                <a class="ant-dropdown-link" href="#">
                                操作 <a-icon type="poweroff" />
                                </a>
                                <a-menu slot="overlay">
                                <a-menu-item  @click="enable(item.ID)" key="1" style="color: #43A047;">开放面试</a-menu-item>
                                <a-menu-item  @click="disable(item.ID)" key="2" style="color: #ff4949;">停止面试</a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </li>
                        <li @click="openChat(item)" style="width: 33.3333%;">面试交流</li>
                    </ul>

                    </div>
                </a-col>
            </a-row>
        </div>
        <div v-else class="list-container">
            <a-table :columns="columns" :dataSource="intentList" :scroll="{ x: 1300, y: 400 }">
                    <span slot="action" slot-scope="text, record">
                        
                        <a @click="showInfo(record)">查看信息</a>
                        <a-divider type="vertical" />
                        <a >二面分配</a>
                        <a-divider type="vertical" />
                        <a class="error" @click="reject(record)">拒绝</a>
                    </span>
            </a-table>
        </div>
        <ChatComponent :visible.sync="chatVisible" :interviewId="interviewId"></ChatComponent>
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
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import { getInterviewList, enableInterview, disableInterview } from '@/api/interview'
import { getIntentList, assign } from '@/api/intent'
import * as intentAPI from '@/api/intent'


import moment from 'moment';
import 'moment/locale/zh-cn';
import { successMessage } from '@/utils/message';

import ChatComponent from '@/components/chat.vue'

@Component({
    components: {
        ChatComponent
    }
})
export default class FirstClass extends Vue {
    @Prop({default: 'card'}) showmode!: string
    get showMode() {
        return this.showmode
    }
    set showMode(newvalue: string) {
        this.$emit('update:showmode', newvalue)
    }
    
    colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

    prase_time(time: string) {
        return moment(new Date(time)).format('LLL')
    }
    parse_status(status: string) {
        if (status === 'cur') {
            return '进行中'
        } else if (status === 'before') {
            return '尚未开始'
        } else {
            return '已结束'
        }
    }

    async enable(id: any) {
        try {
            await enableInterview(id)
            successMessage('面试开启成功')
            this.interviewList = ((await getInterviewList({
                interview_type: 1,
                department: this.$route.name
            })).data).data
        } catch (error) {

        }
    }
    async disable(id: any) {
        try {
            await disableInterview(id)
            successMessage('面试停止成功')
            this.interviewList = ((await getInterviewList({
                interview_type: 1,
                department: this.$route.name
            })).data).data
        } catch (error) {

        }
    }

    modal_content = {}
    modalVisable = false
    showInfo(record: any) {
        console.log('dasdas')
        this.modal_content = {
            ...record,
            other_info: JSON.parse(record.other_info) 
        }
        this.modalVisable = true
    }

    columns = [
        { title: '编号', width: 70, dataIndex: 'ID', key: 'ID', fixed: 'left' },
        { title: '面试者', width: 120, dataIndex: 'name', key: 'interview_id', fixed: 'left' },
        { title: '部门', dataIndex: 'department', key: 'department', width: 150 },
        { title: '主面试官', dataIndex: 'interview.director', key: '2', width: 150 },
        { title: '时间', dataIndex: 'interview.start_time', key: '3', width: 250 },
        { title: '面试组名', dataIndex: 'interview.name', key: 'name', width: 150 },
        { title: '主状态', dataIndex: 'main_stage', key: 'main_stage', width: 100 },
        { title: '副状态', dataIndex: 'sub_stage', key: 'sub_stage', width: 100 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 240,
            scopedSlots: { customRender: 'action' },
        },
    ];

    interviewList = []
    intentList = []

    async created() {
        this.interviewList = ((await getInterviewList({
            interview_type: 1,
            department: this.$route.name
        })).data).data
        console.log(this.$route.name)
        // const substage_map = ['', '', '已分配未确认']
        this.intentList = ((await getIntentList({mainStage: 'First', department: this.$route.name})).data).data
        // .map(item => {
        //     return {
        //         ...item,
        //         sub_stage_str: substage_map[item.sub_stage],
        //         target_interview_str: item.target_interview_id === 0 ? '自动分配' : `${item.target_interview_id}`
        //     }
        // })
    }

    chatVisible = false;
    interviewId = 0;
    openChat(interview: any) {
        console.log(interview)
        this.interviewId = interview.ID;
        this.chatVisible = true;
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
.ant-card-actions {
    li {
        cursor: pointer !important;
    }
}
.error {
    color: red;
}
.avatar {
    font-size: 12px !important;
    line-height: 25px !important;
    cursor: pointer;
}
.card {
    margin-top: 20px;
    // margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    .main {
        padding: 20px;
    }
    .card-body {
        font-size: 14px;
        .first {
            margin-top: 10px !important;
        }
        div {
            margin-top: 6px !important;            
        }
        .status {
            margin-top: 0px !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            .avatar {
                span {
                    width: 24px;
                    height: 24px;
                    font-size: 10px;
                    margin-left: -10px;
                }
            }
            .update-at {
                color: rgba(0, 0, 0, 0.25)
            }
        }

    }
}
.ant-card-actions {
    background: #F7F9FA !important;
}
.list-container {
    margin-top: 25px;
}
</style>
