<template>
  <div >
    <div class="content" >
      <Layout>
        <Content :style="{background: '#fff', minHeight: '700px'}">
          <div style="margin-top:20px" >
            <i-form ref="formInline" inline>
              <!--<FormItem label="应用：" class="input_sty">-->
                <label class="_lab">应用：</label>
                <Select v-model="applicationValue1" style="width:150px;" placeholder="应用名称" @on-change="getApplicationApi">
                  <Option v-for="item in applicationList" :value="item.applicationId" :key="item.applicationId">{{ item.appName}}/{{item.applicationId}}</Option>
                </Select>
              <!--</FormItem>-->
              <!--<FormItem label="接口：" class="input_sty">-->
                <label class="_lab">接口：</label>
                <Select style="width:150px" v-model="interfaceValue1" placeholder="接口名称" >
                  <Option v-for="item in interfaceList" :value="item.id" :key="item.id">{{item.apiName}}</Option>
                </Select>
              <!--</FormItem>-->
              <label class="_lab">用户：</label>
              <!--<FormItem label="用户：" class="input_sty" >-->
                <i-input type="text" style="width: 150px;" placeholder="用户ID" v-model="userIds">
                </i-input>
              <!--</FormItem>-->

              <!--<FormItem label="访问时间：" class="input_sty">-->
                <label class="_lab">访问时间：</label>
                <DatePicker type="date" placeholder="开始时间" style="width: 150px" v-model="startTime" @on-change="getStartTime" :value='timeStart'></DatePicker>
                -
                <DatePicker type="date" placeholder="结束时间" style="width: 150px" v-model="endTime" @on-change="getEndTime" :value='timeEnd'></DatePicker>

              <!--</FormItem>-->

              <!--<FormItem class="btn_sty">-->
                <Button type="primary"  style="background-color: #202D40;border-color: #202D40;margin-left: 25px" @click="select">查询</Button>
                <Button type="primary" @click="_clearQuery" style="background-color: #202D40;border-color: #202D40;">重置</Button>
              <!--</FormItem>-->
            </i-form>

          </div>
          <div style="padding: 10px">
            <Table  :loading="loading" :columns="columns" :data="tabledata"></Table>
            <Page class="tablePage"  :page-size-opts=pageSizeOpts
                  show-sizer :page-size="page.pageSize" :show-total="true"
                  @on-change="_changeNo"
                  :total="page.total" transfer @on-page-size-change="_changeSize"
                   size="small" :current="page.pageNo"></Page>
          </div>

        </Content>
      </Layout>
    </div>
    <div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        timeStart:'',
        timeEnd:'',
        userIds:'',
        pageSizeOpts:[10,20,50,100,200],
        interfaceValue1:"",
        applicationValue1:"",
        startTime:"",
        endTime:'',
        interfaceList:[],
        applicationList:[],
        page: {
          pageNo: 1,
          pageSize: 10,
          total: 10,
          limit: 10,
          offset: 0
        },
        pageParams: {
          appId: "",
          logTime: "",
          userIds: "",
          parameter: "",
        },
        loading: false,
        selectlist: {
          lyxt: [],
          lyb: [],
          czlx: [],
          zt: []
        },
        columns1:[],
        columns: [
          {
            title : '应用',
            key : 'appName',
            align: 'center',
            valign: 'middle',
            sortable: true
          },
          {
          title: '接口',
          key: 'apiName',
          align: 'center',
          valign: 'middle',
          sortable: true
        },
          {
            title : '用户ID',
            key : 'employeeNumber',
            align: 'center',
            valign: 'middle',
            sortable: true
          },
          {
            title : '姓名',
            key : 'contactName',
            align: 'center',
            valign: 'middle',
            sortable: true
          },

          {
            title : '访问ip',
            key : 'ip',
            align: 'center',
            valign: 'middle',
            sortable: true
          },
          {
            title : '访问时间',
            key : 'requestTime',
            align: 'center',
            valign: 'middle',
            sortable: true
          },
          {
            title : '响应时间',
            key : 'respTime',
            align: 'center',
            valign: 'middle',
            sortable: true
          }
        ],
        tabledata: [],
        time:'',

      };
    },
    mounted() {

        this.achieveApplication()

      let arr = Object.getOwnPropertyNames(this.$route.query);
      if(arr.length==0){
        this.achieveTable()
      }else{
        if(this.$route.query.application==''){
          this.applicationValue1=this.$route.query.application;

        }else {
          this.applicationValue1=parseInt(this.$route.query.application)
        }
        if(this.$route.query.apiId==''){
          this.interfaceValue1=this.$route.query.apiId

        }else {
          this.interfaceValue1=parseInt(this.$route.query.apiId)
        }
        this.startTime=this.$route.query.date
        this.showDetail()
      }
    },
    methods: {
      renderTime(date) {
    let  dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
      showDetail(){
        this.loading=true


        this.achieveApi()
        let obj={
          applicationId:this.applicationValue1?this.applicationValue1:'',
          apiId:this.interfaceValue1?this.interfaceValue1:'',
          date:this.$route.query.date,
          hour:this.$route.query.time,
          pageNum:this.page.pageNo,
          pageSize:this.page.pageSize
        }

        this.axios.postForm('apiCount/getAllCountInfoOnDate',obj)
          .then((res)=>{
            this.tabledata=res.content.list
            for(let i=0;i<this.tabledata.length;i++){
              this.tabledata[i].requestTime=this.renderTime(this.tabledata[i].requestTime)
            }
            this.page.total=res.content.total
            this.loading=false
          })
      },
      select(){
        let arr = Object.getOwnPropertyNames(this.$route.query);
        if(arr.length==0){
          this.achieveTable()
        }else{
          this.showDetail()
        }
      },
      getStartTime(s){
        this.startTime=s


      },
      getEndTime(m){
        this.endTime=m
      },
        achieveApplication(){
          this.axios.postForm('applicationManagement/getAllApplication',{})
            .then((res)=>{
              this.applicationList=res.content
            })
        },
      getApplicationApi(val){
        this.applicationValue1=val
        this.achieveApi()
      },
        achieveApi(){
         this.axios.postForm('apiManagement/getApiByApplication',
           {applicationId:this.applicationValue1})
           .then((res)=>{
              this.interfaceList=res.content
           })

        },




      _clearQuery() {
        this.startTime=''
        this.endTime=''
        this.applicationValue1=''
        this.userIds=''
          this.interfaceValue1=''
      },
      _changeNo(val) {
        this.page.pageNo =val;
        let arr = Object.getOwnPropertyNames(this.$route.query);
        if(arr.length==0){
          this.achieveTable()
        }else{
          this.showDetail()
        }

      },
      _changeSize(val) {
        this.page.pageSize = val;
        let arr = Object.getOwnPropertyNames(this.$route.query);
        if(arr.length==0){
          this.achieveTable()
        }else{
          this.showDetail()
        }


      },
        achieveTable(){
        this.loading=true
        let obj={
          applicationId:this.applicationValue1?this.applicationValue1:'',
          apiId:this.interfaceValue1?this.interfaceValue1:'',
          employeeNumber:this.userIds,
          preTime:this.startTime,
          endTime:this.endTime,
          pageNum:this.page.pageNo,
          pageSize:this.page.pageSize
        }
            this.axios.postForm('apiCount/getAllApiCountInfoByPage',obj)
              .then((res)=>{

                this.tabledata=res.content.list
                for(let i=0;i<this.tabledata.length;i++){
                  this.tabledata[i].requestTime=this.renderTime(this.tabledata[i].requestTime)
                }
                this.page.total=res.content.total
                this.loading=false

              })
        }

    },
    components: {}
  };
</script>

<style scoped>

   .content{
    /*display: flex;*/
    /*padding: 20px 0;*/
    /*height: 100%;*/
    max-width: 1200px;
    margin: auto;
  }
  .tablePage {
    text-align: right;
    margin-top: 8px;
  }

   ._lab{
     margin-left: 15px;
   }
  .newStyle ul li{
    list-style: none;
    padding: 5px 0;
  }
  .newStyle{
    /*float: right;*/
    position: absolute;
    height: 200px;
    z-index: 101;
    overflow-y: auto;
    background-color: white;
    right: 15px;
    top:165px;
    border:1px solid #eeeeee ;
    padding: 1px 5px;
    box-shadow: -1px -1px 1px 1px #eeeeee7a;
  }
  ::-webkit-scrollbar
  {
    width: 6px;
    height: 6px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #999;
  }

</style>
<style>



</style>
