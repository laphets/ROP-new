<template>
    <a-modal
      :visible="visible"
      title='新建组织'
      okText='新建'
      cancelText='取消'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='组织名'>
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入组织名称!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='部门(用空格作分隔)'>
          <a-input
            type='textarea'
            v-decorator="[
              'department',
              {
                rules: [{ required: true, message: '请输入部门列表!' }],
              }
            ]"
          />
        </a-form-item>
        <!-- <a-form-item class='collection-create-form_last-form-item'>
          <a-radio-group
            v-decorator="[
              'modifier',
              {
                initialValue: 'private',
              }
            ]"
          >
              <a-radio value='public'>Public</a-radio>
              <a-radio value='private'>Private</a-radio>
            </a-radio-group>
        </a-form-item> -->
      </a-form>
    </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component
export default class CreateClass extends Vue {
    @Prop(Boolean) visible !: boolean

    beforeCreate() {
        (this as any).form = (this as any).$form.createForm(this);
    }
}
</script>