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
                        <div class="card_title">{{item.name}}</div> 
                        <hr class="card_line">
                        <div class="card_info">
                            <p class="card_info_detail">{{item.info}}</p>
                            <p class="card_edit_time">{{item.UpdatedAt}}</p>
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

        <div class="working_area">
            <div class="tips">
                <a-button :disabled="buttonDisabled" @click="save" :type="'primary'">保存</a-button>
                (tips: Ctrl+C/V 复制粘贴, Delete 删除, Ctrl+Z/Y 撤销/重做)
            </div>
            <div id="palette" style="height: 10%;"></div>
            <div id="diagram" style="height: 90%;"></div>
        </div>

    </div>
</template>

<script lang="ts">
const dataSource = [
{
    ID: 1,
    name: '2018春纳报名表',
    info: '这是求是潮2018春季纳新报名表',
    UpdatedAt: 'Last Edit Time is 2017.12.1 20:35'
}, 
{
    ID: 2,
    name: '跳跳鱼',
    info: '跳跳鱼啦啦啦啦啦啦',
    UpdatedAt: 'Last Edit Time is 2008.1.1 23:12'
 
}, {
    ID: 3,
    name: '裸犇的报名表',
    info: '哈哈哈哈哈哈哈啊哈哈哈哈哈',
    UpdatedAt: 'Last Edit Time is 1908.3.6 08:48'
}]

import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import go, { DraggingTool, Diagram, Palette, GraphLinksModel } from 'gojs';
import { IForm } from '@/interfaces/form.interface';
import { getFormList } from '@/api/form';
import { successMessage, errorMessage } from '@/utils/message';
let $ = go.GraphObject.make
@Component
export default class InstancePageClass extends Vue {
            
    renderData: object[] = dataSource
    diagram = {} as Diagram
    palette = {} as Palette
    form = { name: 'text', data: []} as IForm
    buttonDisabled = true

    async created() {
        const { data } = (await getFormList()).data
        this.renderData = data
        console.log('data', this.renderData);
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

    sort(value: string) {
        let word = value
        let newData: object[] = []
        console.log(this.renderData)
        dataSource.map((item, index) => {
            if (!item.name.indexOf(word)) {
                newData.push(item)
            }
        })
        this.renderData = newData 
    }

    mounted() {
        let diagram = $(go.Diagram, 'diagram', {
            'initialContentAlignment': go.Spot.Center,
            'allowDrop': true,
            'scrollsPageOnFocus': false,
            'undoManager.isEnabled': true,
            'grid.visible': false
        })

        diagram.addDiagramListener('Modified', (e: any) => {
            this.buttonDisabled = !diagram.isModified
        })

        const nodeStyle = [
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            { locationSpot: go.Spot.Center }
        ]

        const makePort = (name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean) => {
            const horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
            return $(go.Shape, {
                fill: 'transparent',
                strokeWidth: 0,
                width: horizontal ? NaN : 8,
                height: !horizontal ? NaN : 8,
                alignment: align,
                stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
                portId: name,
                fromSpot: spot,
                fromLinkable: output,
                toSpot: spot,
                toLinkable: input,
                cursor: 'pointer',
                mouseEnter: (e: any, port: any) => {
                    if (!e.diagram.isReadOnly) { port.fill = 'rgba(255,0,255,0.5)' }
                },
                mouseLeave: (e: any, port: any) => {
                    port.fill = 'transparent'
                }
            })
        }

        const textStyle = {
            font: "bold 11pt Helvetica, Arial, sans-serif",
            stroke: "whitesmoke"
        }

        diagram.nodeTemplateMap.add('TEXT', 
            $(go.Node, 'Table', nodeStyle, 
                $(go.Panel, 'Auto', 
                    $(go.Shape, 'Rectangle',
                        { fill: '#00A9C9', strokeWidth: 0 },
                        new go.Binding('figure', 'figure')),
                    $(go.TextBlock, textStyle, {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay())
                ),
                makePort('T', go.Spot.Top, go.Spot.Top, false, true),
                makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        ))

        diagram.linkTemplate =
            $(go.Link, {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    resegmentable: true,
                    mouseEnter: (e: any, link: any) => { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)' },
                    mouseLeave: (e: any, link: any) => { link.findObject('HIGHLIGHT').stroke = 'transparent' },
                    selectionAdorned: false
                },
                new go.Binding('points').makeTwoWay(),
                $(go.Shape, { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
                $(go.Shape, { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
                    new go.Binding('stroke', 'isSelected', (sel: boolean) => sel ? 'dodgerblue' : 'gray').ofObject()),
                $(go.Shape, { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
                $(go.Panel, 'Auto', { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
                    new go.Binding('visible', 'visible').makeTwoWay(),
                    $(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8', strokeWidth: 0 }),
                    $(go.TextBlock, 'Yes', {
                        textAlign: 'center',
                        font: '10pt helvetica, arial, sans-serif',
                        stroke: '#333333',
                        editable: true
                    },
                    new go.Binding('text').makeTwoWay())
                )
            )

        diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
        diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal

        // diagram.startTransaction('new object')
        let model = $(go.GraphLinksModel)
        model.linkFromPortIdProperty = "fromPort"  // necessary to remember portIds
        model.linkToPortIdProperty = "toPort"
        diagram.model = model

        let palette = $(go.Palette, 'palette', {
                scrollsPageOnFocus: false,
                nodeTemplateMap: diagram.nodeTemplateMap,
                model: new go.GraphLinksModel([
                    { category: 'TEXT', text: '简答题' },
                ])
            }
        )

        this.diagram = diagram
        this.palette = palette
    }

    judge(data: any[]) {
        return true
    }

    save() {
        let inverseMap: {[key: number]: number} = {}
        let data = []
        const { nodeDataArray, linkDataArray } = this.diagram.model as any
        for (let i = 0; i < nodeDataArray.length; i++) {
            data.push({ tag: i + 1, type: nodeDataArray[i].category, text: nodeDataArray[i].text, next: -1})
            inverseMap[nodeDataArray[i].key] = i + 1
        }
        for (let e of linkDataArray) {
            data[inverseMap[e.from] - 1].next = inverseMap[e.to]
        }
        console.log('data:', data);
        if (this.judge(data)) {
            successMessage('保存成功！')
            this.form.data = data
            this.diagram.isModified = false
        } else {
            errorMessage('表单逻辑错误，保存失败！')
        }
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
.tips{
    margin: 1% 1%
}
</style>
