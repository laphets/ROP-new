<template>
    <div class="association-page">
        <div class="container">
            <a-skeleton active :loading="loading">
                <div>
                    <a-button @click="showModal()">新建组织</a-button>
                    <CreateModal
                    ref="collectionForm"
                    :visible="visible"
                    @cancel="handleCancel"
                    @create="handleCreate"
                    />
                    <div v-for="(associationData, index) in associationList" :key="index">
                    <h2>{{associationData.name}}</h2>
                    <ul>
                        <li v-for="item in associationData.department">{{item}}</li>
                    </ul>
                    </div>

                </div>
            </a-skeleton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class'
import CreateModal from './components/create.vue'
import { getAssociationList, createAssociation } from '@/api/association'
import { successMessage, errorMessage } from '@/utils/message';
@Component({
    components: {
        CreateModal
    }
})
export default class AssociationViewPageClass extends Vue {
    @Getter('departmentList') departmentList!: string;
    associationList = [];
    loading = true;
    visible = false

    async created() {
        const { data } = (await getAssociationList()).data
        data.forEach((item: any) => {
            item.department = item.department_list.split('&')
        })
        this.associationList = data;

        this.loading = false
    }

    showModal() {
        this.visible = true;
    }
    handleCancel() {
      this.visible = false;
    }
    handleCreate() {
      const form = (this.$refs.collectionForm as any).form;
      form.validateFields(async (err: any, values: any) => {
        if (err) {
          return;
        }
        const {department, name} = values;
        try {
            const data = await createAssociation({
                name,
                department: department.split(" ")
            })
            successMessage('组织新建成功')
            form.resetFields();
            this.visible = false;
        } catch (error) {
            errorMessage('组织新建失败')
            return
        }
      });
    }
}
</script>

<style lang="less" scoped>

.association-page {
    height: calc(100vh - 70px);
    padding: 20px;
    .container {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
        border-radius: 4px;
        padding: 28px 36px 10px 36px;
    }
}
</style>
