<template>
    <div class="association-page">
        <div class="container">
            <a-skeleton active :loading="loading">
                <a-list
                    class="loadmore-list"
                    :loading="loading"
                    itemLayout="horizontal"
                    :dataSource="data"
                >
                    <!-- <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-spin v-if="loadingMore" />
                    <a-button v-else @click="onLoadMore">loading more</a-button>
                    </div> -->
                    <a-list-item slot="renderItem" slot-scope="item, index">
                    <a slot="actions">管理</a>
                    <a slot="actions">更多</a>
                    <a-list-item-meta
                        :description="`${item.department} - Last Seen: ${get_relative_time(item.last_seen)}`"
                    >
                        <a slot="title" href="https://vuecomponent.github.io/ant-design-vue/">{{item.inner_id}}</a>
                            <a-avatar slot="avatar" :style="{backgroundColor: colorList[index % colorList.length], verticalAlign: 'middle'}"> {{item.inner_id[0]}} </a-avatar>

                    </a-list-item-meta>
                    <div>提醒面试</div>
                    </a-list-item>
                </a-list>
            </a-skeleton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getUserList } from '@/api/association';

import moment from 'moment';
import 'moment/locale/zh-cn';

@Component
export default class AssociationManagePageClass extends Vue {
    loading = true;
    data = [];
    colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
    loadingMore = false;
    showLoadingMore = true;

    get_relative_time(time: string) {
        return time === '0001-01-01T00:00:00Z' ? '很久以前' : moment(new Date(time)).fromNow()
    }

    async created() {
        const { data } = (await getUserList()).data
        this.loading = false;
        this.data = data;
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
        .loadmore-list {
            min-height: 350px;
        }
    }
}
</style>
