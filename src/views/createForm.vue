<template>
    <div class="page-container">

        <div class="form-container">
            <a-input-search
            class="search"
            size="large"
            placeholder="请输入要查找的表单名称"
            @search="sort"
            enterButton
            >
            </a-input-search>

                <div v-for="(item,index) in formList" :key="item.ID">
                    <div
                    class="card"
                    :class="selectedIndex == index? 'selected': ''"
                    @click="togoSelect(index)"
                    >
                        <div class="body">
                            <div class="title">{{item.name}}</div> 
                            <div class="line"></div>
                            <!-- <div class="info">
                                <p class="info_detail">{{item.info}}</p>
                            </div> -->
                            <div class="update">最后更新日期:{{parse_time(item.UpdatedAt)}}</div>
                        </div> 

                        <ul class="action ant-card-actions" slot="actions">
                            <li style="width: 25%;"><a-icon type="star-o" @click="star" /></li>
                            <li style="width: 25%;"><a-icon type="form" @click="edit"/></li>
                            <li style="width: 25%;"> <a-icon type="file-pdf" @click="print"/></li>
                            <li style="width: 25%;"> <a-icon type="delete" @click="trash"/></li>
                        </ul>
                    </div>
                </div>
        </div>

        <div class="gojs-container">
            <div class="btn-container">
                <div class="left">
                    <a-button :type="'primary'">新建表单</a-button>
                </div>
                <div class="right">
                    <a-button >全部清空</a-button>
                    <a-button >撤销操作</a-button>
                    <a-button :disabled="buttonDisabled" @click="save" :type="'primary'">保存</a-button>
                </div>
            </div>
            <div id="palette" style="height: 10%;"></div>
            <div id="diagram" style="height: 90%;"></div>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import go, { DraggingTool, Diagram, Palette, GraphLinksModel } from 'fuckgojs';
import { IForm } from '@/interfaces/form.interface';
import { getFormList } from '@/api/form';
import { successMessage, errorMessage } from '@/utils/message';
import moment from 'moment';
import 'moment/locale/zh-cn';
let $ = go.GraphObject.make
@Component
export default class InstancePageClass extends Vue {
            
    formList = [] as object[];
    diagram = {} as Diagram
    palette = {} as Palette
    form = { name: 'text', data: []} as IForm
    buttonDisabled = true
    selectedIndex = 0;

    async created() {
        const { data } = (await getFormList()).data
        console.log(data)
        this.formList = data;

        // this.$nextTick(() => {
        //     // this.selectedId = 0;
        // })
        // this.renderData = data
        // console.log('data', this.renderData);
    }

    parse_time(time: any) {
        return moment(new Date(time)).format('LLL')
    }

    togoSelect(index: number) {
        this.selectedIndex = index;
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
        // let word = value
        // let newData: object[] = []
        // console.log(this.formList)
        // dataSource.map((item, index) => {
        //     if (!item.name.indexOf(word)) {
        //         newData.push(item)
        //     }
        // })
        // this.formList = newData 
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
.action {
    border-top: 0px !important;
    background: #ffffff !important;
}
.page-container{
    display: flex;
    padding: 30px 0px;
    .gojs-container{
        background-color: white;
        height: calc(100vh - 110px);
        width: calc(100vw - 600px);
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        .btn-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 4px;
            .right {
                button {
                    margin: 0px 4px;
                }
            }
        }
    }
    .form-container {
        padding: 0px 20px;
        width: 310px;
        .selected {
            border: 2px solid #4291f7 !important;
        }
        .card {
            cursor: pointer;
            ul {
                border-radius: 8px !important;
            }
            margin-top: 10px;
            width: 100%;
            height: 180px;
            border: 2px solid #e8e8e8;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 8px;
            .body {
                padding: 16px 16px 0px 16px;
                height: 100%;
                position: relative;
                .title {
                    font-size: 16px;
                    font-weight: 400;
                    color: #4A4A4A;
                }
                .line {
                    height: 1px;
                    margin: 4px 0px;
                    background: #E9E9E9;
                }
                .update {
                    position: absolute;
                    bottom: 0;
                    font-size: 11px;
                    color: #9B9B9B;
                }
            }
        }
    }

}


</style>
