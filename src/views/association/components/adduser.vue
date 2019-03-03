<template>
    <a-modal
      :visible="visible"
      title='添加用户'
      okText='添加'
      cancelText='取消'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">

        <a-form-item label='组织'>
            <a-select
            v-decorator="[
              'association_id',
              {
                rules: [{ required: true, message: '请选择一个组织' }],
              }
            ]">
            <a-select-option v-for="(item, index) in associationList" :value="item.ID">
            {{item.name}}
            </a-select-option>
        </a-select>
        </a-form-item>
        <a-form-item label='姓名'>
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入姓名!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='学号'>
          <a-input
            v-decorator="[
              'ZJUid',
              {
                rules: [{ required: true, pattern: /^[0-9]{10}$/, message: '请输入正确的学号!' }],
              }
            ]"
          />
        </a-form-item>


        <a-form-item label='手机'>
          <a-input
            v-decorator="[
              'mobile',
              {
                rules: [{ required: true, pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/ , message: '请输入正确的手机号!' }],
              }
            ]"
          />
        </a-form-item>
        <!-- <a-form-item label='部门'>
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入组织名称!' }],
              }
            ]"
          /> -->
        </a-form-item>

        <a-form-item class='collection-create-form_last-form-item'>
          <a-radio-group
            v-decorator="[
              'admin_level',
              {
                initialValue: 0,
              }
            ]"
          >
              <a-radio :value='1'>管理员</a-radio>
              <a-radio :value='0'>普通用户</a-radio>
            </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { getAssociationList } from '@/api/association'
@Component
export default class CreateClass extends Vue {
    @Prop(Boolean) visible !: boolean
    associationList = []
    async beforeCreate() {
        (this as any).form = (this as any).$form.createForm(this);
        const { data } = (await getAssociationList()).data
        this.associationList = data
    }
}
</script>