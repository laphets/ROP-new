<template>
    <div class="index-page">
        <div class="events-card">
          <!-- <a-button @click="openChat()">Open</a-button> -->
            <!-- <ChatComponent :visible.sync="visible" :interviewId="roomId"></ChatComponent> -->
            <a-calendar>
                <ul class="events" slot="dateCellRender" slot-scope="value">
                <li v-for="item in getListData(value)" :key="item.content">
                    <a-badge :status="item.type" :text="item.content" />
                </li>
                </ul>
                <template slot="monthCellRender" slot-scope="value">
                <div v-if="getMonthData(value)" class="notes-month">
                    <section>{{getMonthData(value)}}</section>
                    <span>Backlog number</span>
                </div>
                </template>
            </a-calendar>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ChatComponent from '@/components/chat.vue'

@Component({
  components: {
    ChatComponent
  }
})
export default class IndexPageClass extends Vue {
    created() {
        // console.log('233')
    }

    openChat() {
      this.visible = true;
    }
    visible = false;
    roomId = 0;

    getListData(value: any) {
      let listData;
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: '技术研发中心第一场面试.' },
            { type: 'success', content: 'This is usual event.' },
          ]; 
          break;
        case 10:
          listData = [
            { type: 'warning', content: '技术研发中心第一场面试.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ]; 
          break;
        case 15:
          listData = [
            { type: 'warning', content: '技术研发中心第一场面试' },
            { type: 'success', content: 'This is very long usual event。。....' },
            { type: 'error', content: 'This is error event 1.' },
            { type: 'error', content: 'This is error event 2.' },
            { type: 'error', content: 'This is error event 3.' },
            { type: 'error', content: 'This is error event 4.' },
          ]; 
          break;
        default:
      }
      return listData || [];
    }

    getMonthData(value: any) {
      if (value.month() === 8) {
        return 1394;
      }
    }
}
</script>

<style lang="less" scpoed>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}

.index-page {
    padding: 30px;
    .events-card {
        // height: 70vh;
        // width: 80vh;
        background: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        // padding: 28px 36px 10px 36px;
    }
}
</style>
