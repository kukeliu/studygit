<template>
  <div>
    <span class="fs-18">新建接口</span>
    <Tabs value="name1" class="mt-20">
      <TabPane label="标准模式" name="name1" class="bj-model">
        <div ><span class="w-40">应用类型:</span>
          <Select v-model="application" style="width:365px;margin-left: -3px;">
            <Option v-for="item in apiList" :value="item.applicationId" :key="item.applicationId">{{ item.appName }}</Option>
          </Select>
        </div>
        <div class="mgt-20"><span class="w-40">接口名称:</span><Input v-model="apiInfo.apiName" placeholder="接口名称" style="width: 90%;" /></div>
        <div class="mgt-20"><span class="w-40">管理人员:</span>
          <Select v-model="apiInfo.apiAuthor" style="width:365px;margin-left: -3px;">
            <Option v-for="item in createList" :value="item.zgh" :key="item.name">{{ item.name }}-{{item.zgh}}</Option>
          </Select>
        </div>
        <div class="mgt-20"><span class="w-40">运维人员:</span>
          <Select v-model="apiInfo.apiOperation" style="width:365px;margin-left: -3px;">
            <Option v-for="item in createList" :value="item.zgh" :key="item.name">{{ item.name }}-{{item.zgh}}</Option>
          </Select>
        </div>
        <span class="w-40">接口描述:</span><Input type="textarea" :rows="4" v-model="apiInfo.apiDesc" placeholder="请输入一句话描述该接口" style="width: 90%;margin-top: 20px;" />
        <div style="height: 30px; border-bottom: 1px solid #f5f7fa;"></div>
        <div class="mgt-20">
          <span class="w-40">数据源:</span>
          <Select v-model="dataSource" style="width:365px;margin-left: -3px;">
            <Option v-for="item in dataList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </div>
        <div class="mgt-20">
          <span class="w-40">时间格式:</span>
          <Input v-model="apiInfo.formatter" placeholder="时间格式" style="width: 90%;" />
        </div>
        <div class="mgt-20">
          <span class="w-40">日期字段:</span>
          <Input v-model="apiInfo.dataZiduan" placeholder="日期字段" style="width: 90%;" />
        </div>
        <div class="mgt-20">
          <span class="w-40">开始时间:</span>
          <Input v-model="apiInfo.startTime" placeholder="开始时间" style="width: 90%;" />
        </div>
        <div class="mgt-20">
          <span class="w-40">结束时间:</span>
          <Input v-model="apiInfo.endTime" placeholder="结束时间" style="width: 90%;" />
        </div>
        <div class="mgt-20">
          <span class="w-40">接口表格:</span>
          <Input v-model="apiInfo.tableName" placeholder="请输入需要查询的表格名称" style="width: 40%;" />
        </div>
        <Button type="primary" size="large" style="margin-top: 60px;background-color: #202D40;border-color: #202D40;" @click="addApi">新建接口</Button>
      </TabPane>
      <!--<TabPane label="SQL模式" name="name2">暂未开发</TabPane>-->
    </Tabs>
  </div>
</template>

<script>

  import Wrapper from '@/components/wrapper1.vue'
  export default{
    components: {
      Wrapper
    },
    inject:  ['reload1'],
    data() {
      return {
        apiList:[],
        application:'',
        fieldIds:[],
        show:false,
        inAll:false,
        outAll:false,
        out:'',
        in:'',
        page:{
          pageNum:1,
          pageSize:10,
          pageTotal:100
        },
        apiInfo:{
          tableName:'',
          apiName:'',
          apiAuthor:'',
          apiOperation:'',
          apiDesc:'',
          formatter:'',
          startTime:'',
          endTime:'',
          dataZiduan:''
        },
        dataSource:'',
        dataList:[],
        createList:[],
        tabList:[],
      }
    },

    mounted() {
      this.getAllUser();
      this.getAllDatasource();
      this.getImgUrl();
      this.getAllAPPlication()
    },
    methods: {
      getAllAPPlication(){
        this.axios.postForm('applicationManagement/getAllApplication',{})
          .then((res)=>{
            this.apiList=res.content
            this.application=parseInt(this.$route.query.applicationid)
            // this.getApplicationApi();
          })
      },



      searchTable(){
        if(this.dataSource==''){
          this.$Message.warning('请先选择数据源');
        }else{
          this.searchTabByDatasource();
        }
      },



      //获取负责人下拉选项
      getAllUser(){
        this.axios.postForm("user/getAllUser",{}).then(res=>{
          if(res.code==="10000"){
            this.createList = res.content;
          }
        })
      },
      getAllDatasource(){
        this.axios.postForm("apiManagement/getAllDatasource",{}).then(res=>{
          if(res.code==="10000"){
            this.dataList = res.content;
          }
        })
      },

      addApi(){
          this.axios.post('apiManagement/createBatchApi',{
            "alternateFieldOne": this.application,
            "apiName": this.apiInfo.apiName,
            "principalId": this.apiInfo.apiAuthor,
            "operationId": this.apiInfo.apiOperation,
            "apiDescription":this.apiInfo.apiDesc,
            "sourceProjectCode":this.dataSource,
            "tableName": this.apiInfo.tableName,
            "alternateFieldThree": this.apiInfo.dataZiduan,
            "format": this.apiInfo.formatter,
            "pre_date": this.apiInfo.startTime,
            "sub_date": this.apiInfo.endTime
          }).then((res)=>{

          })

      },

      //随机获取图片
      getImgUrl(){
        let random = Math.floor(Math.random()*25+1);
        return random;
      },
      userParentMethod(){
        this.reload1();
      },

    }
  }
</script>

<style scoped>
  .w-40{
    width: 80px;
    display: inline-block;
  }
  .mgt-20{
    margin-top: 20px;
  }
  .bj-model{

  }
  /*.bj-model >>> .ivu-table{*/
  /*width: 1000px!important;*/
  /*}*/
  .page{
    float: right;
    margin-top: 20px;
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
  .mt-20 >>> .ivu-tabs-ink-bar{
    background-color: #202D40;
  }
  .mt-20 >>> .ivu-tabs-nav .ivu-tabs-tab-active{
    color: #202D40;
  }
</style>
