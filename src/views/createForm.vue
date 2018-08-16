<template>
    <div class="page-container">

        <div class="formList" style="width: 250px">
            
            <a-input-search
            class="certain-category-search"
            size="large"
            style="width: 100%; margin: 10% 10% 0"
            placeholder="请输入要查找的表单名称"
            @search="sort"
            enterButton
            >
            </a-input-search>

                <div v-for="item in renderData" :key="item.title">
                    <a-card
                    class="card"
                    :bordered="false"
                    hoverable
                    style="width: 250px;"
                    >   
                        <div class="card_title">{{item.title}}</div> 
                        <hr class="card_line">
                        <div class="card_info">
                            <p class="card_info_detail">{{item.info}}</p>
                            <p class="card_edit_time">{{item.time}}</p>
                        </div>
                        <ul class="ant-card-actions" slot="actions">
                            <li style="width: 25%;"><a-icon type="star-o" @click="star" /></li>
                            <li style="width: 25%;"><a-icon type="form" @click="edit"/></li>
                            <li style="width: 25%;"> <a-icon type="file-pdf" @click="print"/></li>
                            <li style="width: 25%;"> <a-icon type="delete" @click="trash"/></li>
                        </ul>
                    </a-card>
                </div>
        </div>

        <div class="working_area"></div>

    </div>
</template>

<script lang="ts">
const dataSource = [
{
    id: 1,
    title: '2018春纳报名表',
    info: '这是求是潮2018春季纳新报名表',
    time: 'Last Edit Time is 2017.12.1 20:35'
}, 
{
    id: 2,
    title: '跳跳鱼',
    info: '跳跳鱼啦啦啦啦啦啦',
    time: 'Last Edit Time is 2008.1.1 23:12'
 
}, {
    id: 3,
    title: '裸犇的报名表',
    info: '哈哈哈哈哈哈哈啊哈哈哈哈哈',
    time: 'Last Edit Time is 1908.3.6 08:48'
}]

import { Component, Vue, Watch } from 'vue-property-decorator';
@Component
export default class InstancePageClass extends Vue {
    data() {
        return {
            renderData: dataSource,
        }
    }

    // test function

    fish() {
        console.log('ttfish')
    }

    // further function

    star() {
        console.log('star')
    }

    edit() {
        console.log('edit')
    }

    print() {
        console.log('print to pdf')
    }

    trash() {
        console.log('delete')
    }

    // bind search function 

    sort(value) {
        let word = value
        let newData
        // dataSource.map((item, index) => {
        //     if(item.title.indexOf(word)){
        //         newData.push(item)
        //     }
        // }) 
    } 
}
</script>

<style lang="less" scoped>
.page-container{
    display: flex
}

.working_area{
    background-color: white;
    height: 900px;
    width: 700px;
    margin-left: 10%;
    margin-top: 5%;
    box-shadow: 4px 4px 4px rgb(145, 145, 145)

}

.card_title{
    font-weight: bold;
    font-size: 16px
}

.card_info{
    height: 160px;
    opacity: 0.7;
}

.card_line{
    opacity: 0.5;
}

.card_edit_time{
    position: relative;
    top: 110px;
    font-size: 12px;
}

.card{
    margin: 10% 10%
}
</style>
