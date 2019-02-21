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

                <div v-for="item in renderList" :key="item.ID">
                    <div
                    class="card"
                    :class="selectedID == item.ID? 'selected': ''"
                    @click="togoSelect(item.ID)"
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
                    <a-button @click="handleCreate" :type="'primary'">新建表单</a-button>
                    <a-modal
                    title="新建表单"
                    v-model="createModalVisible"
                    @ok="handleCreateOk"
                    @cancel="handleCreateCancel"
                    >
                        <a-form :form="form">
                            <a-form-item label="表单名称">
                                <a-input
                                placeholder="请输入表单名称"
                                v-decorator="[
                                    'name',
                                    { rules: [{ required: true, message: '请输入表单名称' }] }
                                ]"
                                />
                            </a-form-item>
                        </a-form>
                    </a-modal>
                </div>
                <div class="right">
                    <a-button @click="handleClear">全部清空</a-button>
                    <a-button :disabled="! selectedID" @click="handleUndo">撤销操作</a-button>
                    <a-button :disabled="buttonDisabled" @click="handleSave" :type="'primary'">保存</a-button>
                </div>
            </div>
            <div class="editor-container">
                <div id="palette" style="height: 15%;"></div>
                <div id="diagram" style="height: 85%;"></div>
            </div>
            <a-modal
            title="编辑问题"
            v-model="editModalVisible"
            @ok="handleEditOk"
            @cancel="handleEditCancel"
            >
                <a-form :form="form">
                    <a-form-item label="题目类型">
                        <a-select @change="handleCategoryChange"
                            v-decorator="[
                                'category',
                                {
                                    rules: [{ required: true, message: '请选择题目类型' }]
                                }
                            ]"
                        >
                            <a-select-option value="SELECT">选择题</a-select-option>
                            <a-select-option value="TEXT">简答题</a-select-option>
                            <a-select-option value="TEXTAREA">论述题</a-select-option>
                            <a-select-option value="INPUT">输入框</a-select-option>
                            <a-select-option value="BOX">BOX</a-select-option>
                            <a-select-option value="UPLOAD">上传文件</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="选项个数">
                        <a-input-number :min="0" :max="26" :initialValue="0" :disabled="choiceDisabled"
                            v-decorator="[
                                'choiceCount',
                                {
                                    rules: [{ required: true, message: '请输入选项个数' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import go, { DraggingTool, Diagram, GraphLinksModel } from 'fuckgojs';
import { RawForm, IForm, INode, IChoice } from '@/interfaces/form.interface';
import { getFormList, updateForm, createForm } from '@/api/form';
import { successMessage, errorMessage } from '@/utils/message';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { setTimeout } from 'timers';
let $ = go.GraphObject.make
const typeMap: {[key: string]: string} = { 'TEXT': '简答题', 'TEXTAREA': '论述题', 'INPUT': '输入框', 'UPLOAD': '上传文件', 'BOX': 'BOX', 'SELECT': '选择题' }
const defaultPort = { id: 'B', 'text': '默认跳转' }
@Component
export default class InstancePageClass extends Vue {
    formList = [{ name: '' }] as RawForm[]
    renderList = [] as object[]
    diagram = {} as Diagram
    tempForm = {} as IForm
    buttonDisabled = true
    selectedID = 0
    createModalVisible = false
    editModalVisible = false
    form = {} as object
    choiceDisabled = false
    editIndex = -1

    async getData() {
        const { data } = (await getFormList()).data
        this.formList = data
        this.renderList = []
        data.forEach((item: RawForm)=> {
            this.renderList.push({ name: item.name, ID: item.ID, UpdatedAt: item.UpdatedAt })
        })
    }

    async created() {
        this.form = this.$form.createForm(this)
        await this.getData()
    }

    parse_time(time: any) {
        return moment(new Date(time)).format('LLL')
    }

    createEmptyModel() {
        let model = $(go.GraphLinksModel)
        model.linkFromPortIdProperty = 'fromPort'
        model.linkToPortIdProperty = 'toPort'
        return model
    }

    judgeModel() {
        let inverseMap: {[key: number]: number} = {}
        const { nodeDataArray, linkDataArray } = this.diagram.model as go.GraphLinksModel
        const n = nodeDataArray.length
        let inDegree: number[] = new Array<number>(n)
        let adjEdge: number[][] = new Array<Array<number>>(n)
        let queue: number[] = []
        nodeDataArray.forEach((item: any, index: number) => {
            inverseMap[item.key] = index
            inDegree[index] = 0
            adjEdge[index] = []
        })
        for (let e of linkDataArray as any) {
            const u = inverseMap[e.from], v = inverseMap[e.to]
            inDegree[v]++
            adjEdge[u].push(v)
        }
        inDegree.forEach((degree: number, vertex: number) => {
            if (degree === 0) queue.push(vertex)
        })
        if (queue.length > 1) return false
        while (queue.length) {
            let u = queue[0]
            queue.shift()
            for (let v of adjEdge[u]) {
                if (--inDegree[v] === 0) {
                    queue.push(v)
                }
            }
        }
        for (let degree of inDegree)
            if (degree > 0) return false
        return true
    }

    findIndex(key: number) {
        const { nodeDataArray } = this.diagram.model as go.GraphLinksModel
        nodeDataArray.every((item: any, index: number) => {
            if (item.key === key) {
                this.editIndex = index
                return false
            }
            return true
        })
    }

    generateForm() {
        let inverseMap: {[key: number]: number} = {}
        let data = [] as INode[]
        const { nodeDataArray, linkDataArray } = this.diagram.model as go.GraphLinksModel
        nodeDataArray.forEach((item: any, index: number) => {
            inverseMap[item.key] = index + 1
            let node = { tag: index + 1, type: item.category, text: item.next, next: -1 }
            if (item.category === 'SELECT') {
                let choices = [] as IChoice[]
                for (let c of item.choices) {
                    if (c.id === 'B') continue
                    choices.push({ tag: c.id, text: c.text, next: -1 })
                }
                data.push({ ... node, choices: choices })
            } else {
                data.push(node)
            }
        })
        for (let e of linkDataArray as any) {
            const u = inverseMap[e.from], v = inverseMap[e.to]
            const node = data[u - 1] as any
            if (e.fromPort === 'B') {
                node.next = v
                if (node.type === 'SELECT')
                    node.default_jump = true
            } else {
                const index = Number(e.fromPort) - 1
                node.choices[index].next = v
            }
        }
        return data
    }

    generateModel(data: INode[]) {
        let model = this.createEmptyModel()
        let NArray = [], LArray = []
        for (let item of data) {
            let node = { key: item.tag, category: item.type, text: item.text, choices: [defaultPort] as object[] }
            if (item.next !== -1) {
                LArray.push({ from: item.tag, to: item.next, fromPort: 'B', toPort: 'T' })
            }
            if (item.choices) {
                for (let c of item.choices) {
                    node.choices.push({ id: c.tag, text: c.text })
                    if (c.next !== -1) {
                        LArray.push({ from: item.tag, to: c.next, fromPort: c.tag, toPort: 'T' })
                    }
                }
            }
            NArray.push(node)
        }
        model.nodeDataArray = NArray
        model.linkDataArray = LArray
        return model
    }

    async loadForm() {
        let self = this
        let selectedForm = {} as RawForm
        this.formList.every((item: RawForm) => {
            if (item.ID === self.selectedID) {
                selectedForm = item
                return false
            }
            return true
        })
        this.tempForm = { name: selectedForm.name, data: JSON.parse(selectedForm.data) }
        this.diagram.model = await this.generateModel(this.tempForm.data)
    }

    async togoSelect(ID: number) {
        if (this.diagram.isModified) {
            errorMessage('当前表单未保存！')
            // TODO
        } else {
            this.selectedID = ID
            await this.loadForm()
        }
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
        this.formList.map((item: RawForm, index: number) => {
            if (item.name && !item.name.indexOf(word)) {
                newData.push({ name: item.name, ID: item.ID, UpdatedAt: item.UpdatedAt })
            }
        })
        this.renderList = newData
    }

    mounted() {
        let diagram = $(go.Diagram, 'diagram', {
            'initialContentAlignment': go.Spot.Center,
            'allowDrop': true,
            'scrollsPageOnFocus': false,
            'undoManager.isEnabled': true,
            'grid.visible': false,
            layout: $(go.TreeLayout, {
                angle: 90
            })
        })

        diagram.addDiagramListener('Modified', (e: any) => {
            this.buttonDisabled = !diagram.isModified
        })

        diagram.addDiagramListener('ObjectDoubleClicked', async (e: any) => {
            if (e.subject.panel instanceof go.Node && e.subject.panel.data) {
                (this as any).form.resetFields()
                this.findIndex(e.subject.panel.data.key)
                this.editModalVisible = true
                await setTimeout(() => {
                    (this as any).form.setFieldsValue({
                        category: e.subject.panel.data.category,
                        choiceCount: e.subject.panel.data.choices.length - 1
                    })
                    this.choiceDisabled = (e.subject.panel.data.category !== 'SELECT')
                }, 100)
            }
        })

        const nodeStyle = [
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                stretch: go.GraphObject.Fill,
                selectionAdorned: false,
                isShadowed: true,
                shadowBlur: 6,
                shadowColor: 'rgba(0, 0, 0, .12)',
                shadowOffset: new go.Point(0, 0)
            }
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

        const fontFamily = 'Microsoft YaHei, PingFang SC, Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif'

        const addNode = (type: string) => diagram.nodeTemplateMap.add(type, 
            $(go.Node, 'Auto', nodeStyle,
                $(go.Shape, 'RoundedRectangle', { fill: '#ffe', stroke: null }),
                $(go.Panel, 'Table', { minSize: new go.Size(60, 30), margin: new go.Margin(0, 6, 6, 6) },
                    $(go.RowColumnDefinition, {
                        column: 0,
                        stretch: go.GraphObject.Horizontal,
                        alignment: go.Spot.Center
                    }),
                    $(go.TextBlock, {
                        row: 0, column: 0,
                        font: `14px ${fontFamily}`,
                        stroke: '#333',
                        editable: false,
                        margin: new go.Margin(10, 0, 0, 0),
                        wrap: go.TextBlock.WrapFit,
                        alignment: go.Spot.TopCenter,
                        text: typeMap[type]
                    }),
                    $(go. TextBlock, {
                        row: 1, column: 0,
                        font: `12px ${fontFamily}`,
                        stroke: '#333',
                        margin: new go.Margin(5, 0),
                        editable: true,
                        alignment: go.Spot.TopLeft,
                        maxSize: new go.Size(160, NaN),
                        text: '请输入问题'
                    }, new go.Binding('text', 'text').makeTwoWay()),
                    $(go.Panel, 'Horizontal', { alignment: go.Spot.BottomCenter },
                        new go.Binding('itemArray', 'choices'),
                        {
                            row: 2, column: 0,
                            itemTemplate: $(go.Panel, 'Auto', {
                                    fromSpot: go.Spot.Bottom,
                                    toSpot: go.Spot.Bottom,
                                    fromLinkable: true,
                                    toLinkable: false,
                                    fromMaxLinks: 1,
                                    cursor: 'pointer',
                                    margin: new go.Margin(0, 3),
                                    alignment: go.Spot.Center
                                },
                                new go.Binding('portId', 'id', v => v.toString()),
                                $(go.Shape, 'RoundedRectangle', {
                                    stroke: null,
                                    strokeWidth: 0,
                                    toMaxLinks: 1,
                                    fill: '#c3edff'
                                }, new go.Binding('fill', 'id', v => v === 'B' ? '#c3edff' : '#b8f5db')),
                                $(go.TextBlock, {
                                        font: `12px ${fontFamily}`,
                                        stroke: '#028bc4',
                                        textAlign: 'center',
                                        margin: new go.Margin(3, 5),
                                        editable: true
                                    },
                                    new go.Binding('text', 'text'),
                                    new go.Binding('stroke', 'id', v => v === 'B' ? '#028bc4' : '#00a35c')
                                )
                            )
                        }
                    )
                ),
                makePort('T', go.Spot.Top, go.Spot.Top, false, true)
            )
        )

        addNode('TEXT')
        addNode('TEXTAREA')
        addNode('INPUT')
        addNode('UPLOAD')
        addNode('BOX')
        addNode('SELECT')

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
        diagram.model = this.createEmptyModel()

        let palette = $(go.Palette, 'palette', {
                scrollsPageOnFocus: false,
                nodeTemplateMap: diagram.nodeTemplateMap,
                model: new go.GraphLinksModel([
                    { category: 'TEXT', choices: [defaultPort] },
                    { category: 'TEXTAREA', choices: [defaultPort] },
                    { category: 'INPUT', choices: [defaultPort] },
                    { category: 'UPLOAD', choices: [defaultPort] },
                    { category: 'BOX', choices: [defaultPort] },
                    { category: 'SELECT', choices: [ defaultPort, { id: 1, text: 'A'}, { id: 2, text: 'B'}, { id: 3, text: 'C'}, { id: 4, text: 'D'} ] }
                ])
            }
        )

        this.diagram = diagram
    }

    handleClear() {
        this.diagram.model = this.createEmptyModel()
    }

    handleUndo() {
        this.loadForm()
    }

    handleCreateOk() {
        (this as any).form.validateFields(async (err: boolean, values: any) => {
            if (! err) {
                try {
                    console.log(values)
                    await createForm({ ...values, data : [] })
                    await this.getData()
                    this.createModalVisible = false
                    successMessage('创建成功')
                } catch(err) {
                    console.log(err)
                }
            }
        })
    }

    handleCreateCancel() {
        this.createModalVisible = false
    }

    handleCreate() {
        (this.form as any).resetFields()
        this.createModalVisible = true
    }

    handleEditOk() {
        (this as any).form.validateFields((err: boolean, values: any) => {
            if (! err) {
                const { model } = this.diagram
                model.nodeDataArray = JSON.parse(JSON.stringify(model.nodeDataArray))
                const node = model.nodeDataArray[this.editIndex] as any
                if (! node) return
                if (values.category) {
                    node.category = `${values.category}`
                }
                if (values.category !== 'SELECT') {
                    values.choiceCount = 0
                }
                if (values.choiceCount >= 0) {
                    const { choices } = node
                    while (choices.length - 1 < values.choiceCount)
                        choices.push({ id: choices.length, text: '' })
                    while (choices.length - 1 > values.choiceCount)
                        choices.pop()
                }
                this.diagram.rebuildParts()
            }
        })
        this.editModalVisible = false
    }

    handleEditCancel() {
        this.editModalVisible = false
    }

    handleCategoryChange(value: string) {
        this.choiceDisabled = (value !== 'SELECT')
    }

    async handleSave() {
        if (this.judgeModel()) {
            try {
                this.tempForm.data = this.generateForm()
                await updateForm(this.selectedID, { name: this.tempForm.name, data: this.tempForm.data })
                await this.getData()
                this.diagram.isModified = false
                successMessage('保存成功')
            } catch (err) {
                errorMessage('保存失败')
            }
        } else {
            errorMessage('表单逻辑有误')
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
        flex-flow: column;
        display: flex;
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
        .editor-container {
            flex: 1;
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
