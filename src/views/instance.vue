<template>
    <div class="page-container">
        <a-row :gutter="20">
            <a-col v-for="(i, key) in 4" :span="8">
                <a-card
                    class="card"
                    hoverable
                    >
                    <ul class="ant-card-actions opt-panel" slot="actions">
                        <li style="width: 50%;" class="del">配置</li>
                        <li style="width: 50%;" class="view">查看纳新</li>
                    </ul>
                    <a-card-meta
                        title="求是潮2018秋季纳新">
                    </a-card-meta>
                    <div class="card-main">
                        <p>编号: &nbsp&nbsp&nbsp 000001
                        <br>报名人数: &nbsp&nbsp&nbsp 1
                        <br>创建时间: &nbsp&nbsp&nbsp 2018-07-17 16:09
                        <br>创建者: &nbsp&nbsp&nbsp 求是潮</p>

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
                fieldDecoratorId="form"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择一张有效的报名表' }]}"
                >
                <a-select
                    placeholder='请选择一张报名表'
                >
                    <a-select-option value='male'>求是潮一般报名表 for 2018</a-select-option>
                    <a-select-option value='female'>测试报名表</a-select-option>
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
                format="YYYY/MM/DD HH:mm:ss"
                />
                </a-form-item>
                <a-form-item
                label='纳新备注'
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 12 }"
                fieldDecoratorId="name"
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
import * as moment from 'moment';

@Component
export default class InstancePageClass extends Vue {
    objStyle = {
        display: 'flex'
    }
    createModalVisible = false
    showCreateModal() {
        this.createModalVisible = true
    }
    handleCreateSubmit(e: any) {
      (this as any).form.validateFields((err: boolean, values: any) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const myThis: any = this
          myThis.$message.success('This is a message of success');
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
    height: 238px;
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
