<template>
    <div>
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
                label='面试官'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="interviewers"
                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入所有的面试官' }]}"
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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component
export default class NewInterviewComponent extends Vue {
    @Prop(Boolean) visible !: boolean

    
}

</script>

<style lang="less" scoped>

</style>
