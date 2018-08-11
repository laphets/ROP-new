<template>
    <div class="page">
        <div class="page-container">
            <div class="opt-line">
                <div class="left-opt">
                    <div class="inline unselect">
                        公海
                    </div>
                    <div class="inline unselect">
                        一面
                    </div>
                    <div class="inline select">
                        二面
                    </div>
                </div>
                <div class="right-opt">
                    <a-button @click="mode='card'" :type="mode === 'card'? 'primary' : ''">卡片模式</a-button>
                    <a-button @click="mode='list'" :type="mode === 'list'? 'primary' : ''">列表模式</a-button>
                </div>
            </div>
            <div v-if="mode === 'card'" class="card-container">
                <a-row :gutter="16">
                <a-col v-for="(i, key) in 5" :span="8">
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
                        title="面试一组"
                    >
                    </a-card-meta>
                    <div class="card-body">
                        <div class="first">编号: &nbsp&nbsp&nbsp 00001</div>
                        <div>部门: &nbsp&nbsp&nbsp  技术研发中心</div>
                        <div>主面试官: &nbsp&nbsp&nbsp 皮老板</div>
                        <div>时间: &nbsp&nbsp&nbsp <a-icon type="clock-circle-o" />&nbsp2017-07-17 16:00-17:00 </div>
                        <div class="status">
                            <div>
                                <a-badge status="processing" />进行中 <span class="update-at"> · 五小时前更新</span>
                            </div>
                            <div class="avatar">
                                <a-avatar src="http://101.132.66.238:9000/dev/pilaoban.png" />
                                <a-avatar src="http://101.132.66.238:9000/dev/pilaoban.png"/>
                                <a-avatar src="http://101.132.66.238:9000/dev/pilaoban.png"/>
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
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class InterviewPageClass extends Vue {
    mode = "card"

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
    created() {
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
.page {
    height: calc(100vh - 70px);
    padding: 24px;
    .page-container {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
        border-radius: 4px;
        padding: 28px 36px;
    }
}

.opt-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
}
.right-opt {
    button {
        margin-left: 10px;
    }
}
.inline {
    font-size: 18px;
    display: inline;
    margin-right: 20px;
    cursor: pointer;
}
.unselect {
    color: #A7A5A5
}
.select {
    color: #4A90E2
}
.list-container {
    margin-top: 25px;
}

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
</style>
