<template>
    <div class="association-page">
        <div class="container">
            <a-skeleton active :loading="loading">
                <div>
                    <h2>{{associationData.name}}</h2>
                    <ul>
                        <li v-for="item in associationData.department">{{item}}</li>
                    </ul>
                </div>
            </a-skeleton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getDepartmentList } from '@/api/association';

@Component
export default class AssociationViewPageClass extends Vue {
    associationData = {};
    loading = true;

    async created() {
        const { data } = (await getDepartmentList()).data
        this.associationData = data;
        this.loading = false
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
