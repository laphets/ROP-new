<template>
    <div>
        <a-drawer
        title="Chat"
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="innerVisible"
        >
            <div class="message-container">
                <div v-for="(item, index) in messageList" :key="index">
                    {{item}}
                </div>
            </div>
            <div class="sending-container">
                <a-input v-model="input" @keyup.enter="sendMessage()"></a-input>
                <a-button @click="sendMessage()">发送</a-button>
            </div>
            
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import moment from 'moment';
import 'moment/locale/zh-cn';
import { successMessage } from '@/utils/message';
import { Getter } from 'vuex-class'
import { setTimeout } from 'timers';

import io from 'socket.io-client'

@Component
export default class ChatClass extends Vue {
    @Prop(Number) interviewId !: number
    @Prop(Boolean) visible !: boolean
    @Getter('token') token!: string;
    @Getter('ZJUid') ZJUid!: string;

    get innerVisible(): boolean {
        return this.visible
    }
    set innerVisible(newVal) {
        this.$emit('update:visible', newVal)
    }

    @Watch('visible')
    onVisibleChanged(val: boolean, oldVal: boolean) {
        if (!oldVal && val) {
            // Open Chat
            console.log('Open Chat')
            this.initSocket(this.interviewId)
            return
        }
        if (oldVal && !val) {
            // Close Chat
            console.log('Close Chat')
            this.closeSocket()
            return
        }
    }

    messageList = [] as string[]
    input = ""

    sendMessage() {
        this.socket.emit('new message', this.input)
        // console.log(this.input)
        this.messageList.push(`You said: ${this.input}`)
    }


    socket = {} as SocketIOClient.Socket;
    initSocket(interviewId: number) {
        this.socket = io({
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: this.token,
                        InterviewId: interviewId
                    }
                }
            }
        })

        this.socket.emit('add user')
        this.socket.on('login', (data: any) => {
            this.messageList.push(`You ${data.ZJUid} logined ${data.interviewId}, now there are ${data.numUsers} users.`)
            // console.log(data)
        })

        interface UserJoin {
            ZJUid: string;
            numUsers: number;
        }
        this.socket.on('user joined', (data: UserJoin) => {
            this.messageList.push(`${data.ZJUid} joined, now there are ${data.numUsers} users.`)
            // console.log(data)
        })

        this.socket.on('user left', (data: any) => {
            this.messageList.push(`${data.ZJUid} lefrt, now there are ${data.numUsers} users.`)
            // console.log(data)
        })
        this.socket.on('new message', (data: any) => {
            this.messageList.push(`${data.ZJUid === this.ZJUid ? 'You' : data.ZJUid} said: ${data.message}`)
            // console.log('11' + data)
        })
        this.socket.on('disconnected', () => {
            console.log('disconnected')
        })
        this.socket.on('reconnect', () => {
            console.log('reconnected')
            this.socket.emit('add user')
        })
        this.socket.on('reconnect_error', () => {
            console.log('attempt to reconnect has failed');
        });
    }

    closeSocket() {
        this.socket.close()
        this.socket = {} as SocketIOClient.Socket
    }

    onClose() {
        this.innerVisible = false;

    }

}
</script>

<style lang="less" scoped>
.sending-container {
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 20px;
}
</style>
