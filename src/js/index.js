// 定义组件
var tree = Vue.extend({
    name: 'tree', // 使用标签时候的名字
    props: ['node', 'length'], // 组件之间传递的值, node 节点信息，length 当前节点 children 的长度，为了样式管理
    template: '#tree',  //模板，我这里使用 template 实现，tree 是 template 的 id
    data: function() {
        return {
            // 节点绑定的数据类型 0基本数据类型(string number) 1复杂数据类型(object)
            nodeValueDataType: 0,
            selected: 0,
            options: [
                {
                    name: 'string',
                    value: 0
                },
                {
                    name: 'number',
                    value: 1
                },
                {
                    name: 'object',
                    value: 2
                }
            ],
            id: 0,
            pid: 0
        }
    },
    computed: {
        // 是否有子节点
        hasChildren() {
            let bool = this.node.children.length > 0
            if (bool) {
                this.selected = 2
            } else {
                this.selected = 0
            }
            return bool
        }
    },
    methods: {
        add: function() {
            if (val = prompt('增')) {
                if (val.trim() === '') {
                    alert('参数key值不能为空')
                    return
                }
                var bool = this.node.children.some(function(item, index) {
                    return val.trim() !== '' && item.name == val.trim()
                })
                if (bool) {
                    alert('兄弟节点参数key值重复')
                    return
                } else {
                    this.node.children.push({
                        name: val,
                        val: '',
                        children: []
                    })
                }
            }
        },
        edit: function() {
            if (val = prompt('改')) {
                this.node.name = val
            }
        },
        remove: function() {
            var _this = this
            if (confirm('删')) {
                if (this.$parent.node) {
                    // 找到上级，循环上级 children 列表，删除选中的
                    this.$parent.node.children.forEach(function(item, index) {
                        if (item.name == _this.node.name) {
                            _this.$parent.node.children.splice(index, 1)
                        }
                    })
                } else {
                    // root 节点
                    this.$root.root = {}
                }
            }
        },
        selectType() {
            if (this.selected === 0) {
                // convert to String
                this.node.val = this.node.val.toString()
            } else if (this.selected === 1) {
                // convert to Number
                this.node.val = parseFloat(this.node.val)
            } else if (this.selected === 2) {
                this.node.val = ''
            }
        },
        // 失去焦点 Number类型自动转换
        blurAutoConvert() {
            if (this.selected === 1) {
                this.node.val = parseFloat(this.node.val)
            }
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        root: {
            name: 'dynamic params',
            children: [
                {
                    name: 'mobileNo',
                    val: '13720314834',
                    children: []
                }
            ]
        },
        url:'http://xfjr.ledaikuan.cn:9191/activity/i/h',
        call: 'CashBackVoucher.list',
        ua: 'Ledaikuan_H5_Sign',
        signKey: '68352e6b616875616e77616e672e636f6d',
        // 生成原始参数数据格式
        originData: null,
        // 预览参数数据结构
        previewParamsData: null,
        httpResultStatus: false,
        httpResult: ''
    },
    components: {
        tree
    },
    mounted() {
        this.originData = this.$refs.treeParent.node.children
        this.preview()
    },
    methods: {
        // preview1() {
        //     let object = {}
        //     let count = 0
        //     // let tmpArr = []

        //     function iterator(arr) {
        //         arr.forEach((item0, index0, arr0) => {
        //             object[item0.name] = {}

        //             if (item0.children.length === 0) {
        //                 object[item0.name] = item0.val
        //             } else if (item0.children.length > 0) {
        //                 // tmpArr['item'+count] = 
        //                 item0.children.forEach((itemChild1, indexChild1, itemArr1) => {
        //                     count++
        //                     object[item0.name][itemChild1.name] = {}

        //                     if (itemChild1.children.length === 0) {
        //                         object[item0.name][itemChild1.name] = itemChild1.val
        //                     } else if (itemChild1.children.length > 0) {
        //                         itemChild1.children.forEach((itemChild2, indexChild2, itemArr2) => {
        //                             count++
        //                             object[item0.name][itemChild1.name][itemChild2.name] = {}

        //                             if (itemChild2.children.length === 0) {
        //                                 object[item0.name][itemChild1.name][itemChild2.name] = itemChild2.val
        //                             } else if (itemChild2.children.length > 0) {
        //                                 itemChild2.children.forEach((itemChild3, indexChild3, itemArr3) => {
        //                                     if (itemChild3.children.length === 0) {
        //                                         object[item0.name][itemChild1.name][itemChild2.name][itemChild3.name] = itemChild3.val
        //                                     } else if (itemChild3.children.length > 0) {
        //                                         // ...继续重复
        //                                         count++
        //                                     }
        //                                 })
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        //         })

        //         return object
        //     }

        //     let tmpData = iterator(this.originData)
        //     this.previewParamsData = tmpData
        //     console.log(count)
        // },
        // preview2() {
        //     let originData = this.$refs.treeParent.$children
        //     let object = {}

        //     function iterator(arr) {
        //         arr.forEach((item, index, arr) => {
        //             // root的直接子节点
        //             if (item.node.children.length === 0) {
        //                 object[item.node.name] = item.node.val
                        
        //             } else if (item.node.children.length > 0) {
        //                 iterator(item.$children)
        //             }
        //         })

        //         return object
        //     }

        //     let info = iterator(originData)
        //     console.log(info)
        // },
        preview() {
            const parse = arr => arr.reduce((obj, { name, val, children }) => ({
                    ...obj,
                    ...{
                    [name]: children.length === 0
                        ? val
                        : parse(children)
                    }
                })
            , {})

            let ua = this.ua
            let call = this.call
            let timestamp = new Date().getTime()
            let signKey = this.signKey
            let sign = md5(ua + '&' + call + '&' + timestamp + '&' + signKey)

            let commonParams = {
                call: call,
                ua: ua,
                sign: sign,
                timestamp: timestamp
            }

            let dynamicParams = {
                args: parse(this.originData)
            }

            this.previewParamsData = Object.assign(commonParams, dynamicParams)

            return this.previewParamsData
        },
        test() {
            let paramsObj = this.preview()
            let paramString = JSON.stringify(paramsObj)

            axios({
                method: 'post',
                url: this.url,
                data: paramString
            }).then(res => {
                console.log(res)
                this.httpResultStatus = true
                this.httpResult = res.data
            }).catch(err => {
                console.log(err)
                this.httpResultStatus = false
                this.httpResult = err
            })
        }
    }
})