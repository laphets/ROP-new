<template>
    <div class="loading-container">
        <a-spin class="loading">
        <a-icon slot="indicator" type="loading" style="font-size: 27px" spin />
        </a-spin>
        登录状态验证中...
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class RedirectPageClass extends Vue {
    created() {
        console.log('233')
    }
}
</script>

<style lang="less" scoped>
.loading-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    .loading {
        margin-right: 20px;
    }
}
</style>
