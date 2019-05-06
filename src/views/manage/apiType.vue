<template>
<div>
  <div class="tt">
    <span class="fs-18">接口列表</span>
    <Select v-model="kind" style="width:200px;float: right;" @on-change="chooseApplication">
      <Option v-for="item in appList" :value="item.applicationId" :key="item.applicationId">{{ item.appName }}</Option>
    </Select>
    <!--<Button type="primary" style="float: right;margin-right: 10px;background-color: #202D40;border-color: #202D40;" @click="addApi">新增批量接口</Button>-->
    <Button type="primary" style="float: right;margin-right: 10px;background-color: #202D40;border-color: #202D40;" @click="addNowApi">新增接口</Button>

  </div>
  <Table  :columns="columns1" :data="data1" style="margin-top: 20px" ></Table>
  <Page :total="total" :page-size="pageSize" :current="pageNum"
        @on-change="handlePage" @on-page-size-change="handlePageSize" show-total
        style="margin-top: 20px;float: right"/>
</div>
</template>

<script>

    export default {
       data(){
         return{
           kind:'',
           appList:[],
           columns1:[
             {
               title:'接口名称',
               key:'apiName',

             },
             {
               title:'接口路径',
               key:'apiUrl',

             },
             {
               title:'接口类型',
               key:'alternateFieldTwo',


             },
             {
               title:'接口状态',
               key:'apiStatus',

             },
             {
               title:'接口描述',
               key:'apiDescription',

             },
             {
               title:'管理人',
               key:'principalId',

             },
             {
               title:'运维人姓名',
               key:'operationName',

             },
             {
               title:'表名',
               key:'tableName',

             },
             {
               title:'数据源',
               key:'sourceProjectCode',

             },
             // {
             //   title:'电话',
             //   key:'operationPhone'
             // },
             // {
             //   title:'邮箱',
             //   key:'operationEmail'
             // },
             {
               title:'操作',
               key:'action',

               render:(h,params)=>{
                 return h('div',[
                   h('img',{
                     attrs: {
                       title:'查看详情'
                     },
                     domProps:{
                       align: 'center',
                       src:require('../../assets/seedetail.png')
                     },
                     style: {
                       // marginRight: '3px',
                       cursor: 'pointer',
                       width:'35%'

                     },
                     on: {
                       click: () => {
                         this.$router.push({path:'/apiDetail',query:{apiId:params.row.id,applicationId:params.row.applicationId}})
                       }
                     }
                   }),
                   h('img',{
                     attrs: {
                       title:'测试接口'
                     },
                     domProps:{
                       align: 'center',
                       src:require('../../assets/interface.png')
                     },
                     style: {
                       marginRight: '2px',
                       cursor: 'pointer',
                       width:'30%',
                       display:(params.row.status==1)?'inline-block':'none'


                     },
                     on: {
                       click: () => {
                         this.$router.push({path:'/testapi',query:{applicationId:this.kind,id:params.row.id,status:params.row.apiType}})
                       }
                     }
                   }),
                   h('img',{
                     attrs: {
                       title:'测试接口'
                     },
                     domProps:{
                       align: 'center',
                       src:require('../../assets/test1.png')
                     },
                     style: {
                       marginRight: '2px',
                       cursor: 'pointer',
                       width:'30%',
                       display:(params.row.status==0)?'inline-block':'none'
                     },
                     on: {
                       click: () => {
                         this.$Message.warning('当前接口禁用状态');
                       }
                     }
                   }),
                   h('img',{
                     attrs: {
                       title:'删除'
                     },
                     domProps:{
                       align: 'center',
                       src:require('../../assets/del.png')
                     },
                     style: {

                       cursor: 'pointer',
                       width:'30%'

                     },
                     on: {
                       click: () => {
                         this.delInterface(params)
                       }
                     }
                   }),
                 ])
               }
             }
         ],
           data1:[],
           applicationId:'',
           pageNum:1,
           pageSize:10,
           total:0
         }

       },
      mounted(){

          this.getAllAPPlication()

      },
      methods:{
        handlePage(value){
          this.pageNum=value
          this.getApplicationApi()
        },
        handlePageSize(value){
          this.pageSize=value
          this.getApplicationApi()
        },
        addApi(){
          this.$router.push({path:'/batchInterface',query:{applicationid:this.kind}})
        },
        addNowApi(){
          this.$router.push({path:'/addApi',query:{applicationid:this.kind}})

        },
        getApplicationApi(){
          let obj={
            applicationId:this.kind,
            searchMessage:'',
            pageNum:this.pageNum,
            pageSize:this.pageSize
          }
          this.axios.postForm('apiManagement/getApiByApplicationPage',obj)
            .then((res)=>{
                this.data1=res.content.list
              for(let i=0;i<this.data1.length;i++){
                  if(this.data1[i].apiType==0){
                     this.$set(this.data1[i],'alternateFieldTwo','实时接口')

                  }
                  if(this.data1[i].apiType==1){
                    this.$set(this.data1[i],'alternateFieldTwo','批量接口')
                  }
                if(this.data1[i].status==0){
                  this.$set(this.data1[i],'apiStatus','关闭')

                }
                if(this.data1[i].status==1){
                  this.$set(this.data1[i],'apiStatus','开启')
                }
              }

              this.total=res.content.total
            })
        },
        getAllAPPlication(){
          this.axios.postForm('applicationManagement/getManageApplicationInfo',{})
            .then((res)=>{
              this.appList=res.content

              this.kind=parseInt(this.$route.query.applicationId)
              this.getApplicationApi();
            })
        },
        chooseApplication(){
          // this.applicationId=this.kind
          this.$router.push({path:'/apiType',query:{applicationId: this.kind}})
          this.getApplicationApi()
        },
        delInterface(item){
          // console.log(item)
          this.$Modal.confirm({
            title: '删除',
            content :'是否确认删除'+item.row.apiName+'接口',
            onOk: () => {
                this.axios.postForm('apiManagement/deleteApi',{apiId:item.row.id,apiName:item.row.apiName})
                  .then((res)=>{
                    if(res.code==='10000'){
                      this.getAllAPPlication()
                      this.$Message.success(res.msg)
                    }else{
                      this.$Message.error(res.msg)
                    }
                    // console.log(res)
                  })
            },
          });
        }
      }
    }
</script>

<style scoped>

</style>
