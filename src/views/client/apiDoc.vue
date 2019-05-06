<template>
    <div>
        <span class="fs-18"><span>{{apiName}}</span>接口文档</span>
        <div class="mt-20 bj-model">
            <div><span class="w-40 fw-7">接口说明</span><span class="fc">{{apiInfo.apiDescription}}</span></div>
            <div class="mgt-20"><span class="w-40 fw-7">接口路径</span><span class="fc">{{apiInfo.apiUrl}}</span></div>
            <div class="mgt-20"><span class="w-40 fw-7">请求方式</span><span class="fc">{{apiMethod}}</span></div>
            <div class="mgt-20"><span class="w-40 fw-7">返回类型</span><span class="fc">{{apiFormat}}</span></div>
            <!--<div class="mgt-20"><span class="w-40 fw-7">请求参数</span><span class="fc">{{apiInfo.example}}</span></div>-->
            <!--<div class="mgt-20"><span class="w-40 fw-7">接口备注</span><span class="fc">{{apiInfo.apiRemake}}</span></div>-->
            <div style="height: 30px; border-bottom: 1px solid #f5f7fa;"></div>
            <div class="mgt-20">
                <span style="font-size: 14px;" class="fw-7 rqparam mgl-10">请求参数说明</span>
                <Table border :columns="columns1" :data="data1" class="mgt-20" height="300"></Table>
            </div>
            <div class="mgt-20">
                <span style="font-size: 14px;" class="fw-7 rqparam mgl-10">请求参数示例</span>
                <div class="prediv">
                    <pre><code style="padding: 0" class="hljs"><span>{{qingqiu}} </span></code></pre>
                </div>
            </div>
            <div class="mgt-20">
                <span style="font-size: 14px;" class="fw-7 rqparam mgl-10">返回参数说明</span>
                <Table border :columns="columns2" :data="data2" class="mgt-20" height="300"></Table>
            </div>
            <div class="mgt-20">
                <span style="font-size: 14px;" class="fw-7 rqparam mgl-10">结果返回示例</span>
                <div class="prediv">
                    <pre><code style="padding: 0" class="hljs"><span>{{fanhui}}</span></code></pre>
                </div>
            </div>
            <div>
              <Table border :columns="columns3" :data="data3" class="mgt-20" ></Table>

            </div>
        </div>
    </div>
</template>

<script>
    import Wrapper from '@/components/wrapper1.vue'
    export default{
        components: {
            Wrapper,
            // Clipboard
        },
        data() {
            return {
              columns3:[
                {
                  key:'code',
                  title:'返回码'
                },
                {
                  key:'value',
                  title:'描述'
                }
              ],
              data3:[
                {
                  code:'50001',
                  value:'接口不存在'
                },
                {
                  code:'50002',
                  value:'接口权限不足'
                },
                {
                  code:'50003',
                  value:'访问ip地址不在白名单'
                },
                {
                  code:'50004',
                  value:'接口参数错误'
                },
                {
                  code:'500',
                  value:'系统错误'
                },
                {
                  code:'10000',
                  value:'请求成功'
                }
              ],
                show:true,
                inAll:false,
                outAll:false,
                out:'',
                in:'',
              fanhui:{
                "code": "10000",
                "msg": null,
                "content": [
                  {
                    "mailbox": "11223298@163.com",
                    "phone": "18323258325",
                    "wechat_number": "3114"
                  },
                  {
                    "mailbox": "11223299@163.com",
                    "phone": "18323258324",
                    "wechat_number": "3114"
                  }
                ]
              },
                qingqiu: {
                  "zgh":13666501,
                  "apiId":85,
                  "columns":"phone,mailbox,wechat_number",
                  "params":[
                    {
                      "group": "AND",
                      "filter": [
                        {
                          "name": "phone",
                          "value": "1",
                          "operator": ">="
                        },
                        {
                          "name": "mailbox",
                          "value": "1",
                          "operator": ">="
                        }
                      ]
                    },
                    {
                      "group": "OR",
                      "filter": [
                        {
                          "name": "wechat_number",
                          "value": "1",
                          "operator": ">="
                        }
                      ]
                    }
                  ]
                },
                apiInfo:{
                    status:"",
                    tableName:'',
                    apiUrl:'',
                    apiName:'',
                    principalId:'',
                    operationId:'',
                    phone:'',
                    email:'',
                    apiDescription:'',
                    sourceProjectCode:'',
                    inputFieldList:[],
                    outFieldList:[],
                    fieldConfigList:[],
                },
                apiMethod:'http',
                apiFormat:'application/json',
                example:'https://www.baidu.com?userName=admin&passwd=123456',
                apiRemake:'备注，使用需要注意的是https',
                columns1: [
                    {
                        title: '字段名称',
                        key: 'fieldName',
                        // width:150
                    },
                    {
                        title: '字段类型',
                        key: 'fieldType',
                        // width:200
                    },
                    {
                        title: '说明',
                        key:'fieldChinese',
                        // width: 500,
                        align: 'center',
                    }
                ],
                data1: [

                ],
                columns2: [
                    {
                        title: '字段名称',
                        key: 'fieldName',
                        // width:150
                    },
                    {
                        title: '字段类型',
                        key: 'fieldType',
                        // width:200
                    },
                    {
                        title: '说明',
                        key:'fieldChinese',
                        // width: 500,
                        align: 'center',
                    }
                ],
                data2: [

                ],
                apiName:'',
            }
        },
        created() {},
        mounted() {
            this.apiName = this.$route.query.apiName
            this.getApiInfo();
        },
        methods: {
            async getApiInfo(){
                await this.axios.postForm("apiManagement/getApiDetail",{
                    apiId:this.$route.query.id
                }).then(res=>{
                    this.apiInfo = res.content;
                    //处理输入参数
                    this.handleInField();
                    this.handleOutField();
                })
            },
            handleInField(){
                this.apiInfo.inputFieldList.forEach(inField=>{
                    for(let i=0; i<this.apiInfo.fieldConfigList.length; i++){
                        if(inField==this.apiInfo.fieldConfigList[i].id.toString()){
                            this.data1.push(this.apiInfo.fieldConfigList[i]);
                        }
                    }
                })
            },
            handleOutField(){
                this.apiInfo.outFieldList.forEach(outField=>{
                    for(let i=0; i<this.apiInfo.fieldConfigList.length; i++){
                        if(outField==this.apiInfo.fieldConfigList[i].id.toString()){
                            this.data2.push(this.apiInfo.fieldConfigList[i]);
                        }
                    }
                })
            },
            handleClose () {
                this.show = false;
            },
            searchTable(){
                this.show = true;
            },
            selectOne(index,param){
                let ref = param+index;
                if(this.$refs[ref]._data.currentValue){
                    if(param==='in'){
                        this.inAll = false;
                    }else if(param==='out'){
                        this.outAll = false;
                    }

                }
            },
            selectAll(params,pre,value){
                if(!value){
                    for(let i=0; i<5; i++){
                        let ref = pre+i
                        ;            this.$refs[ref]._data.currentValue = true;
                    }
                }else{
                    for(let i=0; i<5; i++){
                        let ref = pre+i;
                        this.$refs[ref]._data.currentValue = false;
                    }
                }
            },
            getinRef(index){
                return "in"+index;
            },
            getoutRef(index){
                return "out"+index;
            },
            submit(){
                this.axios.post().then(res=>{

                })
            },

        }
    }
</script>

<style scoped>
    .w-40{
        width: 60px;
        display: inline-block;
    }
    .mgt-20{
        margin-top: 20px;
    }
    .mgl-20{
        margin-left: 20px;
    }
    .mgl-10{
        margin-left: 10px;
    }
    .bj-model{

    }
    .fw-7{
        font-weight: 700;
    }
    .fc{
        color: #777777;
    }
    .prediv{
        background: #fafafa;
        max-height: 400px;
        overflow: auto;
    }
    .prediv pre{
        color: rgb(102, 102, 102);
        white-space: pre;
        /*line-height: 24px;*/
        font-family: 微软雅黑;
        /*padding: 20px 0px 20px 20px;*/
        margin: 10px 0px;
        overflow: hidden;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(231, 231, 231);
        border-image: initial;
        border-radius: 4px;
        background: rgb(252, 252, 252);
    }
    .hljs{
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        color: #383a42;
        background: #fafafa;
    }
    /*.bj-model >>> .ivu-table{*/
    /*width: 1000px!important;*/
    /*}*/
    .page{
        float: right;
        margin-top: 20px;
    }
    .rqparam::before{
        content: '';
        width: 4px;
        height: 16px;
        background: #00aeff;
        border-radius: 2px;
        position: absolute;
        margin-left: -9px;
        margin-top: 3px;
    }
    /*.bj-model >>> .ivu-table:after{*/
        /*width: 0px;*/
    /*}*/
    /*.bj-model >>> .ivu-table:before{*/
        /*height: 0px;*/
    /*}*/
    /*.bj-model >>> .ivu-table-wrapper{*/
        /*border-top: 0;*/
    /*}*/
</style>
