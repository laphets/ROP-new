<template>
    <div class="page-container">
        <a-row :gutter="20">
            <a-col v-for="(item, index) in instanceList" :key="item.ID" :span="8">
                <a-card
                    class="card"
                    hoverable
                    >
                    <ul class="ant-card-actions opt-panel" slot="actions">
                        <li style="width: 33.33%;">
                            <a-dropdown placement="bottomCenter">
                                <div>
                                配置 <a-icon type="down" />
                                </div>
                                <a-menu slot="overlay" @click="onClick">

                                <a-menu-item key="3">更改信息</a-menu-item>
                                <a-menu-item key="4" style="color: #ff4949;">删除实例</a-menu-item>
                                </a-menu>
                            </a-dropdown></li>
                        <li style="width: 33.33%;">
                            <a-dropdown placement="bottomCenter">
                                <a class="ant-dropdown-link" href="#">
                                操作 <a-icon type="poweroff" />
                                </a>
                                <a-menu slot="overlay" @click="onClick">
                                <a-menu-item key="1" style="color: #43A047;">开放实例</a-menu-item>
                                <a-menu-item key="2" style="color: #ff4949;">暂停实例</a-menu-item>
                                </a-menu>
                            </a-dropdown></li>
                        <li style="width: 33.33%;" class="view" @click="enterInstance(item.ID, item.name)">进入纳新</li>
                    </ul>
                    <a-card-meta
                        :title="item.name">
                    </a-card-meta>
                    <div class="card-main">
                        <p>纳新状态: &nbsp&nbsp&nbsp <a-badge :status="item.status === 'cur'? 'processing': (item.status === 'before'? 'error': 'success')" />
                        {{parse_status(item.status)}}
                        <br>报名人数: &nbsp&nbsp&nbsp {{item.freshman_count}}
                        <br>开始时间: &nbsp&nbsp&nbsp {{prase_time(item.start_time)}}
                        <br>结束时间: &nbsp&nbsp&nbsp {{prase_time(item.end_time)}}
                        <br>绑定表单: &nbsp&nbsp&nbsp {{item.form_name}}
                        <br>创建组织: &nbsp&nbsp&nbsp {{item.association}}
                        </p>
                    </div>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card
                    class="card card-opt"
                    hoverable
                    :bodyStyle="objStyle"
                    @click.native="showCreateModal()"
                    >
                    <div  class="opt-container">
                        <div class="icon">
                            <a-icon type="plus" />
                        </div>
                        <div>
                            新建纳新实例
                        </div>
                    </div>
                </a-card>
            </a-col>
        </a-row>

        <!-- Create New Instance Modal -->
            <a-modal
            title="新建纳新实例"
            wrapClassName="vertical-center-modal"
            v-model="createModalVisible"
            :confirmLoading="submitLoading"
            @ok="handleCreateSubmit"
            okText="确认"
            cancelText="取消"
            >
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                label='纳新名称'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="name"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入纳新实例的名称' }]}"
                >
                <a-input />
                </a-form-item>
                <a-form-item
                label='报名表单'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="form_id"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择一张有效的报名表' }]}"
                >
                <a-select
                    placeholder='请选择一张报名表'
                >
                    <a-select-option v-for="(item, index) in formList" :key="item.ID" :value='item.ID'>{{item.name}}</a-select-option>
                    <!-- <a-select-option :value='2'>测试报名表</a-select-option> -->
                </a-select>
                </a-form-item>
                <a-form-item
                label='纳新时间'
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
                label='允许志愿'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="max_intent"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入允许最多志愿的个数' }]}"
                >
                <a-input-number type="number" :min="1" />
                </a-form-item>
                <a-form-item
                label='纳新备注'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="remark"
                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入纳新实例的备注' }]}"
                >
                <a-input />
                </a-form-item>
                <a-form-item
                label='创建组织'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="association"
                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入纳新实例的备注' }]}"
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
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getInstanceList, createInstance, updateInstance } from '@/api/instance'
import { getFormList } from '@/api/form'
import { successMessage } from '@/utils/message';
@Component
export default class InstancePageClass extends Vue {
    objStyle = {
        display: 'flex'
    }
    createModalVisible = false
    instanceList = []
    submitLoading = false;
    formList = []
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

    async created() {
        const { data } = (await getInstanceList()).data
        this.instanceList = data
    }

    onClick() {

    }
    enterInstance(instanceId: number, instanceName: string) {
        this.$store.dispatch('SetInstance', {instanceId, instanceName})
        successMessage(`已切换至实例${instanceName}`)
    }
    showCreateModal() {
        getFormList().then(res => {
            this.formList = (res.data).data
        })
        this.createModalVisible = true
    }
    handleCreateSubmit(e: any) {
        (this as any).form.validateFields(async (err: boolean, values: any) => {
            if (!err) {
                this.submitLoading = true;
                const time = values.time.map((item: any) => item.format())
                try {
                    await createInstance({
                        ...values,
                        start_time: time[0],
                        end_time: time[1],
                    })
                    const { data } = (await getInstanceList()).data
                    this.instanceList = data
                    this.submitLoading = false;
                    this.createModalVisible = false
                    successMessage('纳新实例创建成功~')
                } catch (error) {
                    this.submitLoading = false;
                }
            }
        })
    }
    moment = moment
}
</script>

<style lang="less" scoped>
.page-container {
    padding: 45px 56px;
}
.card {
    margin-bottom: 20px;
    height: 288px;
    .opt-panel {
        .del {
            color: #4A90E2;
        }
        .del:hover {
            color: #ff4949;
        }
        .view {
            color: rgba(0, 0, 0, 0.45)
        }
    }
    .card-main {
        margin-top: 12px;
        line-height: 25px;
        color: rgba(0, 0, 0, 0.85);
        font-weight : 350;
    }
}
.card-opt {
    background: #F7F9FA;
    display: flex;
    justify-content: center;
    align-content: center;
    .opt-container {
        text-align: center;
        vertical-align :middle;
        margin: auto;
        color: #b9babb;
        .icon {
            font-size: 90px;
            display: flex;
            justify-content: center;
        }
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

/* use css to set position of modal */
.vertical-center-modal {
  text-align: center;
  white-space: nowrap;
}

.vertical-center-modal:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  width: 0;
}

.vertical-center-modal .ant-modal {
  display: inline-block;
  vertical-align: middle;
  top: 0;
  text-align: left;
}
</style>
