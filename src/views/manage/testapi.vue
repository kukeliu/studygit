<template>
  <div class="whole">
    <div class="tt">
      <span class="fs-18">测试接口</span>
    </div>
    <div v-show="jilian==0" style="    font-size: 13px;
    margin-top: 5px;">
        {{appName}}/{{apiName1}}
    </div>
    <div style="margin-top: 20px" v-show="jilian==1">
      <Select v-model="application" style="width:200px;" @on-change="getApiInfo">
        <Option v-for="item in applicationKinds" :value="item.applicationId" :key="item.applicationId">{{ item.appName }}</Option>
      </Select>
      <!--{{application}}-->
      <Select v-model="arr.apiId" style="width:200px;"  @on-change="getTableInfo">
        <Option v-for="item in apiName" :value="item.id" :key="item.id">{{ item.apiName }}</Option>
      </Select>
    </div>
    <div >
      <label  class="labl">
    输出字段
      </label>
      <div style="margin-bottom: 20px">
        <Table  border :columns="columns" :data="brr" height="150" size="small" ref="selection"  @on-selection-change="selectchange">

        </Table>

      </div>

      <div >
        <span >
          <label  class="labl">
          请求参数
        </label>
        </span>
        <span style="float: right;margin-top: -20px">
           <Icon type="md-add-circle" size="20" @click="addTable"/>
        </span>

      </div>

      <div style="padding: 20px; border: 1px solid #e1e2e3;margin-bottom: 10px" v-for="(item,index2) in data3.params">
        <label style="margin-bottom: 20px;display: inline-block">拼接府:</label>

        <Select v-model="item.group" style="width:200px" @click.native="showValue(item,index2)" @on-change="changeValue">
          <Option v-for="item in Symbol" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <img src="../../assets/reduce.png" alt="" style="width: 20px;float: right" @click="reduceTable(index2)">
        <Table  border :columns="columns2" :data="item.data" >

          <template slot-scope="{ row, index }" slot="name" >
            <Select  style="width:180px"  v-model="item.filter[index].name">
              <Option v-for="items in crr" :value="items.fieldName" :key="items.id">{{ items.fieldName }}</Option>
            </Select>
            <!--<Input type="text"   v-model="item.filter[index].name"/>-->
          </template>
          <template slot-scope="{ row, index }" slot="operator">
            <Select  style="width:180px"  v-model="item.filter[index].operator">
              <Option v-for="items in typeList" :value="items.value" :key="items.value">{{ items.name }}</Option>
            </Select>
          </template>
          <template slot-scope="{ row, index }" slot="value" >
            <Input type="text"   v-model="item.filter[index].value"/>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button  @click="handleEdit(row,index,index2)">删除</Button>
          </template>
        </Table>
        <div style="text-align: center;margin-top: 10px">
          <span style="cursor: pointer;" @click="addRow(index2)"><Icon type="md-add-circle"  />&nbsp;添加</span></div>
      </div>
      <div>
        <label  class="labl">
          参数示例
        </label>
      </div>
      <div class="backDate" v-show="status==0">
        <pre>{<br>&nbsp;&nbsp;"zgh":"{{arr.zgh}}",<br>&nbsp;&nbsp;"apiId":"{{arr.apiId}}",<br>&nbsp;&nbsp;"columns":"{{arr.columns}}",<br>&nbsp;&nbsp;"params":{{arr.params}}<br>}</pre>
      </div>
      <div class="backDate" v-show="status==1">
        <pre>{{arr}}</pre>
      </div>
<div v-show="status==0">
  <label  class="labl">返回请求</label>
  <!--<Input v-model="back" type="textarea" :rows="4" placeholder="返回请求内容" />-->
  <div class="backDate">
    <div v-if="backShow" style="color: #c5c6c9;font-size: 14px;font-weight: normal">返回请求内容</div>
    <div v-if="!backShow">
      <pre>{{back}}</pre>
    </div>
  </div>

  <Button type="primary" style="float: right;margin-right: 40px;margin-top: 20px;background-color: #202D40;border-color: #202D40;" @click="testApi">测试接口</Button>

</div>
      <div v-show="status==1">
        <Button type="primary" style="float: right;margin-right: 40px;margin-top: 20px;background-color: #202D40;border-color: #202D40;" @click="downloadApi">批量导出</Button>
        <Select  style="width:180px;float: right;margin-top: 20px; margin-right: 20px;"  v-model="arr.type">
          <Option v-for="items in fileList"

                  :value="items.value" :key="items.value">{{ items.label }}</Option>
        </Select>

      </div>
      <!--<Input v-model="request" type="textarea" :rows="4" placeholder="请输入请求参数内容" />-->

    </div>
  </div>

</template>

<script>

    export default {


        data(){
          return{
            // type:'excel',
            fileList:[
              // {value:'excel',label:'excel'},
              {value:'csv',label:'csv'},
              {value:'dat',label:'dat'}
            ],
            pinjie:'',
            Symbol:[
              {value:'OR',label:'OR'},
              {value:'AND',label:'AND'}
            ],
            application:'',
            applicationKinds:[],
            apiName:[],
            kind:'',
            request:'',
            back:{},
            backShow:true,
            dataArr:[],
            test:"",
            data1:[],
            columns:[
              {
                type: 'selection',
                width: 60,
                align: 'center'
              },
              {
                title: '字段名称',
                key: 'fieldName',
              },
              {
                title: '字段类型',
                key: 'fieldType',
              },
              {
                title: '描述',
                key: 'fieldChinese',
              }
            ],
            typeList:[
              {value:'<=',name:'<=',flag:'true'},
              {value:'>=',name:'>=',flag:'false'},
              {value:'=',name:'=',flag:'false'},
              {value:'like',name:'like',flag:'false'},
            ]

            ,
            data3:{
              zgh:"",
              type: "",
              apiId: "",
              columns: "",
              params:[
                {
                  group:'AND',
                  data:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    },
                  ],
                  filter:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    }
                  ],
                },
              ]
            },
            arr:{
              zgh:"",
              type: "",
              apiId: "",
              columns: "",
              params:[
                {
                  group:'AND',

                  filter:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    }
                  ],
                },
              ]
            },
            // testarr:{
            //   type: "",
            //   apiId: "",
            //   columns: "",
            //   params:[
            //     {
            //       group:'',
            //
            //       filter:[
            //         {
            //           name:'',
            //           value:'',
            //           operator:''
            //         }
            //       ],
            //     },
            //   ]
            // },
            columns2: [
              {
                title: '字段名称',
                slot: 'name'
              },
              {
                title: '字段类型(下拉)',
                slot: 'operator',
              },
              {
                title: '字段值',
                slot: 'value',
              },
              {
                title: '操作',
                slot: 'action',
              },
            ],
            count:0,
            status:'',
            filedArr:'',
            brr:[],
            crr:[],
            filedArr1:'',
            jilian:0,
            applicationName:'',
            apiName1:'',
            appName:'',
            zgh:''
          }
        },
      mounted(){
         this.arr.zgh=sessionStorage.getItem("zgh")
        // console.log(a)
        this.getAllAPPlication()
          if(this.$route.query.rightTitle==undefined){
            this.jilian=1
          }else if(this.$route.query.rightTitle=='已申请的'){
            this.jilian=0
          }
          this.apiName1=this.$route.query.apiName

        for(let i=0;i<this.data3.params.length;i++){
          this.arr.params[i].group=this.data3.params[i].group

          this.arr.params[i].filter=this.data3.params[i].filter
        }
          this.status=this.$route.query.status



      },
      methods:{
        selectchange(selection){

          this.arr.columns=''
          // this.filedArr1=''
          for(let i=0;i<selection.length;i++){
            if(i<(selection.length-1)){
              this.arr.columns+=selection[i].fieldName+','
              // this.filedArr1+=selection[i].id+','
            }else{
              this.arr.columns+=selection[i].fieldName+''
              // this.filedArr1+=selection[i].id+''
            }
          }
        },

        showValue(val,index){
      this.current=index
        },
        downloadApi(){
          let obj={
            "zgh":this.arr.zgh,
            "type":this.arr.type,
            "params":this.arr.params,
            "apiId":this.arr.apiId,
            "columns":this.arr.columns
          }
          if(this.arr.columns.length==0){
            this.$Message.info('请选择输出字段')
          }else {
            this.axios.dpost('apiManagement/batchApiInfo', obj)
              .then((res) => {

                if(res.type=='application/octet-stream'){
                  const content = res
                  const blob = new Blob([content])
                  const elink = document.createElement('a')
                  elink.download = "data.zip"
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(blob)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href)
                  document.body.removeChild(elink)
                }else{
                  this.axios.post('apiManagement/batchApiInfo', obj).then((res)=>{
                    this.$Message.info(res.msg)

                  })
                }


              })
          }
        },
        changeValue(val){
          this.arr.params[this.current].group=val
        },
        handleEdit(row,index,index2){

          this.data3.params[index2].data.splice(row._index,1)
          this.arr.params[index2].filter.splice(row._index,1)
          },
        achieveRow(){
          this.axios.postForm('apiManagement/getApiDetail',{apiId:this.arr.apiId})
            .then((res)=>{
              let arr=[]
              let crr=[]
              for(let i in res.content.outFieldList){
                arr[i]=parseInt(res.content.outFieldList[i])
              }
             for(let j in res.content.inputFieldList){
               crr[j]=parseInt(res.content.inputFieldList[j])
             }

              this.data1=res.content.fieldConfigList
              this.brr=this.data1.filter(item=> arr.indexOf(item.id)>-1)
              this.crr=this.data1.filter(item=> crr.indexOf(item.id)>-1)

            })
        },
        addRow(index){
          let obj= {
            name:'',
            value:'',
            operator:''
          }
          this.$set(this.data3.params[index].data,this.data3.params[index].data.length,obj)
          this.data3.params[index].filter.push(
            {
              name:'',
              value:'',
              operator:''
            }
          )
          for(let i=0;i<this.data3.params.length;i++){
              this.arr.params[i].group=this.data3.params[i].group

            this.arr.params[i].filter=this.data3.params[i].filter
          }
        },
        reduceTable(index){

          if(index!=0){
            this.data3.params.splice(index,1)
            this.arr.params.splice(index,1)
          }else{
            this.$Message.info('至少保留一个')
          }

        },
        addTable(){
          let arr=  {
              group:'AND',
            filter:[
                {
                  name:'',
                  value:'',
                  operator:''
                }
              ],
            data:[
              {
                name:'',
                value:'',
                operator:''
              }
            ],
            }
          this.data3.params.push(arr)
          this.arr.params.push(
            {
              group:'AND',
              filter:[
                {
                  name:'',
                  value:'',
                  operator:''
                }
              ]
            }
          )
          for(let i=0;i<this.data3.params.length;i++){
            this.arr.params[i].group=this.data3.params[i].group
            this.arr.params[i].filter=this.data3.params[i].filter
          }
        },
        getAllAPPlication(){

          if(this.$route.query.rightTitle==='已申请的'){
                this.axios.postForm('apiUserManagement/getApiInfo',{
                  titleMessage:'已申请的',
                  pageNum:1,
                  pageSize:10
                }).then((res)=>{
                  this.applicationKinds=res.content.applicationList
                  this.application=parseInt(this.$route.query.applicationId)
                  this.applicationKinds.forEach((item)=>{
                    if(item.applicationId==this.application){
                      this.appName=item.appName
                    }
                  })
                  // this.application=res.content.firstApplication.applicationId
                  this.getAllApi()
                })
          }else{
            this.axios.postForm('applicationManagement/getManageApplicationInfo',{})
              .then((res)=>{
                this.applicationKinds=res.content
                this.application=parseInt(this.$route.query.applicationId)
                this.getApi()
              })
          }

        },
        getTableInfo(val){
          // console.log(val)
          if(val!=undefined){
            this.apiName.forEach((item)=>{
              if(item.id==val){
                this.status=item.apiType
              }
            })
            this.arr.apiId=val
            this.achieveRow()
            this.back={}
            this.backShow = true
            this.data3={
              zgh:"",
              type: "",
              apiId:  this.arr.apiId,
              columns: "",
              params:[
                {
                  group:'AND',
                  data:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    },
                  ],
                  filter:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    }
                  ],
                },
              ]
            }
            this.arr={
              zgh:"",
              type: "",
              apiId: this.arr.apiId,
              columns: "",
              params:[
                {
                  group:'AND',

                  filter:[
                    {
                      name:'',
                      value:'',
                      operator:''
                    }
                  ],
                },
              ]
            }
          }

        },
        getApiInfo(val){
          this.application=val

          this.getAllApi()
          this.back={}
          this.backShow = true

        },
        getAllApi(){
          this.axios.postForm('apiManagement/getApiByApplication',{applicationId: this.application})
            .then((res)=>{
              this.apiName=res.content
              this.arr.apiId=this.$route.query.id
              this.achieveRow()
              console.log(this.apiName)
              if(res.content.length==0){
                this.arr.apiId=''
                this.data1=[]
                this.brr=[]
                this.crr=[]
              }

              // this.arr.apiId=this.$route.query.id
              // console.log(this.arr.apiId)
              // const a=parseInt(this.$route.query.id)
              // console.log(a)
              // this.achieveRow()
              // this.back={}

            })
        },
        getApi(){
          this.axios.postForm('apiManagement/getApiByApplication',{applicationId: this.application})
            .then((res)=>{
              this.apiName=res.content
              // this.arr.apiId=res.content[0].id
              this.arr.apiId=this.$route.query.id
              // console.log(this.arr.apiId)
              // const a=parseInt(this.$route.query.id)
              // console.log(a)
              this.achieveRow()
              // this.back={}

            })
        },
        testApi(){
          let obj={
            "zgh":this.arr.zgh,
            "params":this.arr.params,
            "apiId":this.arr.apiId,
            "columns":this.arr.columns
          }
          if(this.arr.columns.length==0){
            this.$Message.info('请选择输出字段')
          }else {
            this.axios.post('apiManagement/testApi', obj)
              .then((res) => {
                this.back = res
                this.backShow = false
              })
          }
        }
      }
    }
</script>

<style scoped>
.labl{
  color: #989aa9;
 padding: 15px 0 5px;
  display: block;
}
  .backDate{
    border: 1px solid #e1e2e3;
    padding: 10px;
    min-height: 200px;
    max-height: 500px;
    overflow-y: auto;
    border-radius: 5px;
    max-width: 910px;
  }
  .whole >>> .ivu-tooltip-rel{
      display: inline-block;
    margin-left: 10px;
    font-weight: bold;
    font-size: 14px;
  }
  pre{
    margin: 0;
  }
</style>
