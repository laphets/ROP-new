<template>
    <div>
        <div v-if="showMode === 'card'" class="card-container">
            <a-row :gutter="16">
                <a-col v-for="(item, index) in interviewList" :key="item.ID" :span="8">
                    <a-card
                    class="card"
                    hoverable
                    :bodyStyle="{padding: '18px'}"
                    >
                    <ul class="ant-card-actions" slot="actions">
                        <li style="width: 33.3333%;">面试管理</li>
                        <li style="width: 33.3333%;">短信发送</li>
                        <li style="width: 33.3333%;">面试记录</li>
                    </ul>
                    <a-card-meta
                        :title="`${item.name}${item.auto_joinable==1 ? '' : '  (保留场次)'}`"
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
                                 <span class="update-at"> · 五小时前更新</span>
                            </div>
                            <div v-if="item.participants.length" class="avatar">
                                <a-avatar v-for="(item1, index) in item.participants" :key="index" src="http://101.132.66.238:9000/dev/pilaoban.png" />
                            </div>
                            <div v-else>
                                暂无面试者
                            </div>
                        </div>
                    </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
        <div v-else class="list-container">
            <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1200, y: 400 }">
                    <span slot="action" slot-scope="text">
                        
                        <a href="#">面试管理</a>
                        <a-divider type="vertical" />
                        <a href="#">短信发送</a>
                        <a-divider type="vertical" />
                        <a href="#">面试记录</a>
                    </span>
            </a-table>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import { getInterviewList } from '@/api/interview'
import { getIntentList, assign } from '@/api/intent'


import moment from 'moment';
import 'moment/locale/zh-cn';

@Component
export default class FirstClass extends Vue {
    @Prop({default: 'card'}) showmode!: string
    get showMode() {
        return this.showmode
    }
    set showMode(newvalue: string) {
        this.$emit('update:showmode', newvalue)
    }
    
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

    columns = [
        { title: '编号', width: 70, dataIndex: 'age', key: 'age', fixed: 'left' },
        { title: '面试组名', width: 120, dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: '部门', dataIndex: 'address', key: '1', width: 150 },
        { title: '主面试官', dataIndex: 'address', key: '2', width: 150 },
        { title: '时间', dataIndex: 'address', key: '3', width: 150 },
        { title: '面试者', dataIndex: 'address', key: '4', width: 150 },
        { title: '状态', dataIndex: 'address', key: '5', width: 150 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 240,
            scopedSlots: { customRender: 'action' },
        },
    ];
    data: any = []

    interviewList = []
    intentList = []

    async created() {
        this.interviewList = ((await getInterviewList({
            interview_type: 1,
            // department: '推广策划中心'
        })).data).data
        this.intentList = ((await getIntentList({mainStage: 'First', department: '技术研发中心'})).data).data
        for (let i = 0; i < 100; i++) {
            this.data.push({
                key: i,
                name: `Edrward ${i}`,
                age: 32,
                address: `London Park no. ${i}`,
            });
        }
    }
}
</script>

<style lang="less" scoped>
.card {
    margin-top: 20px;
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
