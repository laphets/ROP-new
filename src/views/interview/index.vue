<template>
    <div class="page">
        <div class="page-container">
            <div class="opt-line">
                <div class="left-opt">
                    <div v-for="(item, index) in viewType" :key="index" @click="toogleView(index)" class="inline" :class="curView == index? 'select' : 'unselect'">
                        {{item}}
                    </div>
                </div>
                <div class="right-opt">
                    <a-button :disabled="curView == 0" @click="mode='card'" :type="mode == 'card' ? 'primary' : 'default'">卡片模式</a-button>
                    <a-button :disabled="curView == 0" @click="mode='list'" :type="mode == 'card' ? 'default' : 'primary'">列表模式</a-button>
                    <a-divider type="vertical" />
                    <a-button @click="showCreateGroup()" type="dashed">新建面试分组</a-button>
                </div>
            </div>
 
            <div>
                <public-sea v-if="curView == 0" :showmode.sync="mode"></public-sea>
                <first-interview v-if="curView == 1" :showmode.sync="mode"></first-interview>
            </div>
        </div>

<!-- Create new -->
        <a-modal
        style="top: 1px;"
        title="新建面试分组"
        v-model="createGroupVisable"
        :confirmLoading="submitLoading"
        @ok="handleCreateSubmit"
        okText="确认"
        cancelText="取消"
        >
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                label='面试类型'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="interview_type"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择分组类型' }]}"
                >
                <a-select
                    placeholder='请选择一个面试组类型'
                >
                    <a-select-option :value='1'>一面</a-select-option>
                    <a-select-option :value='2'>二面</a-select-option>
                    <!-- <a-select-option :value='2'>测试报名表</a-select-option> -->
                </a-select>
                </a-form-item>
                <a-form-item
                label='自动加入'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="auto_joinable"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择分组类型' }]}"
                >
                
                <a-select
                    placeholder='请选择一个面试者加入类型'
                >
                
                    <a-select-option :value='1'>
                        <a-tooltip>
                            <template slot='title'>
                            自动分配的面试者只能够加入到该场次中
                            </template>
                            自动加入
                        </a-tooltip>
                    </a-select-option>
                    <a-select-option :value='-1'>
                        <a-tooltip>
                            <template slot='title'>
                            手动分配的面试者只能够加入到该场次中
                            </template>
                            手动分配
                        </a-tooltip>
                    </a-select-option>
                    <!-- <a-select-option :value='-1'>手动分配</a-select-option> -->
                    <!-- <a-select-option :value='2'>测试报名表</a-select-option> -->
                </a-select>
                </a-form-item>

                <a-form-item
                label='面试名称'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="name"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入面试组的名称' }]}"
                >
                <a-input />
                </a-form-item>
                <a-form-item
                label='部门'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="department"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择隶属于的部门' }]}"
                >
                <a-select
                    placeholder='请选择一个部门'
                >
                    <a-select-option v-for="(item, index) in departmentList" :key="item" :value='item'>{{item}}</a-select-option>
                    <!-- <a-select-option :value='2'>测试报名表</a-select-option> -->
                </a-select>
                </a-form-item>
                <a-form-item
                label='面试时间'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="time"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入有效的日期和时间' }]}"
                >
                <a-range-picker
                :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                showTime
                format=""
                />
                </a-form-item>

                <a-form-item
                label='人数上限'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="capacity"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入这场面试的人数上限' }]}"
                >
                <a-input-number type="number" :min="1" />
                </a-form-item>

                <a-form-item
                label='主面试官'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="director"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入主面' }]}"
                >
                <a-input />
                </a-form-item>

                <a-form-item
                label='面试场地'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="location"
                
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入面试场地' }]}"
                >
                <a-input placeholder="请填写准确,如:小剧场B座208" />
                </a-form-item>

                <a-form-item
                label='面试官'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="interviewers"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入所有的面试官' }]}"
                >
                <a-input />
                </a-form-item>

                <a-form-item
                label='备注'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="remark"
                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入面试组的备注' }]}"
                >
                <a-input />
                </a-form-item>

                <a-form-item
                :wrapperCol="{ span: 12, offset: 5 }"
                >
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firstInterview from './first.vue'
import publicSea from './publicsea.vue'


import { createInterview } from '@/api/interview'
import { Getter } from 'vuex-class'
import moment from 'moment';
import 'moment/locale/zh-cn';

import { successMessage } from '@/utils/message';

@Component({
    components: {
        firstInterview,
        publicSea
    }
})
export default class InterviewPageClass extends Vue {
    @Getter('departmentList') departmentString!: string;
    moment = moment
    mode = "card"
    curView = 0
    
    department = '' as string | undefined

    viewType = [
        '公海',
        '一面',
        '二面'
    ]
    
    created() {
        this.department = this.$route.name
    }

    toogleView(target: number) {
        this.curView = target
    }

    departmentList = [] as string[]

    createGroupVisable = false
    async showCreateGroup() {
        this.departmentList = this.departmentString.split('&')
        this.createGroupVisable = true
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

    

    submitLoading = false
    handleCreateSubmit(e: any) {
        (this as any).form.validateFields(async (err: boolean, values: any) => {
            if (!err) {
                this.submitLoading = true;
                const time = values.time.map((item: any) => item.format())
                try {
                    await createInterview({
                        ...values,
                        start_time: time[0],
                        end_time: time[1],
                    })
                    this.submitLoading = false
                    this.createGroupVisable = false
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
.page {
    height: calc(100vh - 70px);
    padding: 20px;
    .page-container {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
        border-radius: 4px;
        padding: 28px 36px 10px 36px;
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
</style>
