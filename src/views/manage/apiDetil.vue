<template>
  <div>
    <div class="tt">
      <span class="fs-18">接口详情</span>
      <i-switch v-model="m1" size="large" style="float: right;margin-right: 40px;" :before-change="beforeChange" @on-change="change">
        <span slot="open">开启</span>
        <span slot="close">禁用</span>
      </i-switch>
    </div>
    <div class="mt-20 bj-model">

      <div ><span class="w-40">接口名称:</span>
        <Input :disabled="disShow" v-model="apiInfo.apiName" placeholder="" style="width: 90%;" />
      </div>
      <!--<div class="mgt-20"><span class="w-40">接口简称:</span><Input disabled v-model="apiInfo.apiAlias" placeholder="" style="width: 90%;" /></div>-->
      <!--<div class="mgt-20"><span class="w-40">管理人员:</span>-->
      <!--<Input :disabled="disShow" v-model="apiInfo.principalId" placeholder="" style="width: 90%;" />-->
      <!--</div>-->
      <div class="mgt-20"><span class="w-40">运维人员姓名:</span>
        <Input  v-model="apiInfo.operationName" placeholder="运维人员姓名" style="width: 90%;" />
        <!--<Select v-model="apiInfo.operationId" style="width:365px;margin-left: -3px;" @on-change="changeOperationInfo">-->
          <!--<Option v-for="item in createList" :value="item.zgh" :key="item.name">{{ item.name }}-{{item.zgh}}</Option>-->
        <!--</Select>-->
        <!--<Input :disabled="disShow" v-model="apiInfo.operationId" placeholder="" style="width: 90%;" />-->
      </div>
      <div class="mgt-20"><span class="w-40">运维人员电话:</span>
        <Input  v-model="apiInfo.operationPhone" placeholder="运维人员电话" style="width: 90%;" />
      </div>
      <div class="mgt-20"><span class="w-40">运维人员邮箱:</span>
        <Input  v-model="apiInfo.operationEmail" placeholder="运维人员邮箱" style="width: 90%" />
      </div>
      <div class="mgt-20"><span class="w-40">接口路径:</span>
        <Input disabled v-model="apiInfo.apiUrl" placeholder="" style="width: 90%;" />
      </div>
      <span class="w-40">接口描述:</span>
      <Input :disabled="disShow" type="textarea" :rows="4" v-model="apiInfo.apiDescription" placeholder="" style="width: 90%;margin-top: 20px;" />
      <div style="height: 30px; border-bottom: 1px solid #f5f7fa;"></div>
      <div class="mgt-20"><span class="w-40">数据源:</span>
        <Select v-model="apiInfo.sourceProjectCode" :disabled="disShow" style="width:365px;margin-left: -3px;" @on-change="getAllApi">
          <Option v-for="item in dataList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <!--<Input :disabled="disShow" v-model="apiInfo.sourceProjectCode" placeholder="" style="width: 40%" />-->
      </div>
      <div class="mgt-20">
        <div class="mgt-20"><span class="w-40">接口表格:</span>
          <Select v-model="apiInfo.tableName" :disabled="disShow" style="width:365px;margin-left: -3px;">
            <Option v-for="item in tabList" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <!--{{tabList}}-->
          <!--<Input v-model="apiInfo.tableName":disabled="disShow" placeholder="请输入需要查询的表格名称" style="width: 40%;" />-->
          <Button type="primary" @click="searchTable" style="margin-left: 20px;background-color: #202D40;border-color: #202D40">搜索</Button></div>
        <div class="mgt-20" v-if="show"><Tag  closable @on-close="handleClose">{{apiInfo.tableName}}</Tag></div>

      </div>


      <div style="width: 99%">
        <Table v-if="show" border :columns="columns1" :data="data1">
          <template slot-scope="{ row, index }" slot="inaction" >
            <Checkbox :label="getId(row)" :disabled="disShow"  :value="inputFieldList.indexOf(row.id.toString()) >= 0" :ref="getinRef(index,row)"  @click.native="selectOne(row.id.toString(),'in')" ></Checkbox>
          </template>
          <template slot-scope="{ row, index }" slot="outaction">
            <Checkbox  :label="getId(row)" :disabled="disShow" :value="outFieldList.indexOf(row.id.toString()) >= 0" :ref="getoutRef(index)"  @click.native="selectOne(row.id.toString(),'out')"></Checkbox>
          </template>
        </Table>
        <Page v-if="show" show-total :total="pageParam.total" :current="pageParam.pageNum" class="page" :page-size="pageParam.pageSize" @on-change="handlePage"/>
        <Button type="primary" style="margin-right: 40px;margin-top: 20px;background-color: #202D40;border-color: #202D40;"  @click="submitUpdate">提交修改</Button>

      </div>
    </div>
    <!--<Tabs value="name1" class="mt-20">-->
    <!--<TabPane label="标准模式" name="name1" class="bj-model">-->
    <!---->
    <!--</TabPane>-->
    <!--<TabPane label="SQL模式" name="name2">暂未开发</TabPane>-->
    <!--</Tabs>-->
  </div>
</template>

<script>
  import Wrapper from '@/components/wrapper1.vue'

  export default {
    components: {
      Wrapper
    },
    data() {
      return {
        dataList:[],
        tabList:[],
        disShow: false,
        show: true,
        inAll: false,
        outAll: false,
        out: '',
        in: '',
        m1: true,
        status:1,
        createList:[],
        apiInfo: {
          switch: true,
          status: "",
          tableName: '',
          apiUrl: '',
          apiName: '',
          principalId: '',
          operationName:'',
          operationPhone: '',
          operationEmail: '',
          apiDescription: '',
          sourceProjectCode: '',
          inputFieldList: [],
          // inputFieldList:[],
          fieldConfigList: [],
        },
        columns1: [{
          title: '字段',
          key: 'fieldName',
        },
          {
            title: '字段长度',
            key: 'fieldType',
          },
          {
            title: '描述',
            key: 'fieldChinese',
          },
          {
            title: '输入',
            align: 'center',
            slot: 'inaction',
            renderHeader: (h, params) => {
              return h('checkbox', {
                props: {
                  disabled:this.disShow
                },
                style: {
                  marginLeft: '5px'
                },
                model: {
                  value: this.inAll,
                  // disabled:"disShow",
                  callback: (value) => {
                    this.inAll = value;
                    // this.selectAll(params,'in',this.inAll)
                  },
                },
                nativeOn: {
                  click: () => {
                    this.selectAll(params, 'in', this.inAll)
                  }
                }
              }, '输入')
            }
          },
          {
            title: '输出',
            align: 'center',
            slot: 'outaction',
            renderHeader:(h,params)=>{
              return h('checkbox',{
                props: {
                  disabled:this.disShow
                },
                style: {
                  marginLeft: '5px'
                },
                model: {
                  value: this.outAll,
                  callback: (value) => {
                    this.outAll = value;
                    // this.selectAll(params,'out',this.outAll)
                  },
                },
                nativeOn: {
                  click: () => {
                    this.selectAll(params,'out',this.outAll)
                  }
                }
              },'输出')
            }
          }
        ],
        data1: [],
        pageParam: {
          pageSize: 5,
          offset: 0,
          total: 0,
          pageNum: 1
        },
        fieldIds:[],
        allCheckIdList:[],
        inputFieldList:["94"],
        outFieldList:[],
        name:''
      }
    },
    created() {
      sessionStorage.setItem("in",this.fieldIds);
      sessionStorage.setItem("out",this.fieldIds);
    },
    mounted() {
      this.getAllUser()
      this.getCheckoutNeedData()

      this.getApiInfo(1);
      this.getAllDatasource();

      // this.searchTabByDatasource();
      // getApiInfo
    },
    methods: {
      getAllUser(){
        this.axios.postForm("user/getAllUser",{}).then(res=>{
          if(res.code==="10000"){
            this.createList = res.content;
          }
        })
      },
      changeOperationInfo(){
        this.axios.postForm('user/getUserInfoByZgh',{zgh:this.apiInfo.operationId}).then((res)=>{
          this.apiInfo.phone=res.content.phone
          this.apiInfo.email=res.content.mailbox

        })
      },
      getAllDatasource(){
        this.axios.postForm("apiManagement/getAllDatasource",{}).then(res=>{
          if(res.code==="10000"){
            this.dataList = res.content;
          }
        })
      },
      selectEcho(inFieldArr,pre){

        //获取输入条件的id集合
        let idsArr = [];
        for(let m=0; m<inFieldArr.length; m++){
          for(let i=0; i<this.data1.length; i++){
            if(inFieldArr[m]==this.data1[i].id){
              idsArr.push(i)
            }
          }
        }
        idsArr.forEach(value => {
          let ref = pre+((this.pageParam.pageNum-1)*this.pageParam.pageSize+value);
          if(this.$refs[ref]!=undefined){
            this.$refs[ref]._data.currentValue = true;
          }
        })
      },
      beforeChange(currentValue) {
        return currentValue ? true : new Promise((resolve) => {
          setTimeout(function() {
            resolve(true);
          }, 1000);
        });
      },
      async getCheckoutNeedData() {
        await this.axios.postForm("apiManagement/getApiDetail", {
          apiId: this.$route.query.apiId
        }).then(res => {

          let {content} = res
          let {fieldConfigList,inputFieldList,outFieldList}  = content
          this.allCheckIdList = fieldConfigList.map(item => item.id.toString())

          this.inputFieldList = inputFieldList
          this.outFieldList = outFieldList
          this.outAll = this.outFieldList.length == this.allCheckIdList.length
          this.inAll = this.inputFieldList.length == this.allCheckIdList.length

        })
      },
      async getApiInfo(pageNum) {
        await this.axios.postForm("apiManagement/getApiDetail", {
          apiId: this.$route.query.apiId
        }).then(res => {
          this.apiInfo = res.content;
          this.getAllApi()
          if (res.content.status == "0") {
            this.m1 = false;
            this.status=0
            // this.disShow = true
          } else if (res.content.status == "1") {
            this.m1 = true;
            this.status=1
            this.disShow = false
          }
          this.name=res.content.tableName
          this.pageParam.total = res.content.fieldConfigList.length;
          this.pageHandle(res.content.fieldConfigList, pageNum, res.content.inputFieldList, res.content.outFieldList);
        })
      },
      //分页
      pageHandle(fieldList, pageNum, inList, outList) {
        let start = this.pageParam.pageSize * (pageNum - 1);
        let end = this.pageParam.pageSize * pageNum;
        if(end>this.pageParam.total){
          end=this.pageParam.total
        }
        let selectField = [];
        this.data1 = fieldList;
        for (let i = start; i < end; i++) {
          selectField.push(fieldList[i]);
          for (let j = 0; j < inList.length; j++) {
            if (fieldList[i].id.toString() === inList[i]) {
              fieldList[i].inputId = fieldList[i].id.toString()
            }
          }
          for (let j = 0; j < outList.length; j++) {
            if (fieldList[i].id.toString() === outList[i]) {
              fieldList[i].outputId = fieldList[i].id.toString()
            }
          }
        }
        this.data1 = selectField;
      },
      change(value) {
        if (value) {
          this.apiInfo.status = "1";
          this.$Modal.confirm({
            title: '接口开启',
            content: '是否开启当前接口',
            onOk: () => {
              this.axios.post("apiManagement/updateApi", this.apiInfo).then(res => {
                this.getApiInfo(this.pageParam.pageNum);
              })
            },
            onCancel: () => {
              this.m1 = false;
            }
          });
        } else {
          this.apiInfo.status = "0";
          this.$Modal.confirm({
            title: '接口禁用',
            content: '是否禁用当前接口',
            onOk: () => {
              this.axios.post("apiManagement/updateApi", this.apiInfo).then(res => {
                this.getApiInfo(this.pageParam.pageNum);
              })
            },
            onCancel: () => {
              this.m1 = true;
            }
          });
        }
      },
      handlePage(item) {
        this.pageParam.pageNum = item;

        if(this.name!=this.apiInfo.tableName){
          this.searchTabByDatasource()
        }else{
          this.getApiInfo(this.pageParam.pageNum);
        }

      },
      handleClose() {
        if(this.status==1){
          this.show = false;
        }

      },
      searchTable(){
        this.inAll = false;
        this.outAll = false;
        this.pageParam.pageNum=1
        if(this.apiInfo.sourceProjectCode==''){
          this.$Message.warning('请先选择数据源');
        }else{
          if(this.name!=this.apiInfo.tableName){
            this.searchTabByDatasource()
            this.getApiDetail()

          }else{
            this.getApiInfo(this.pageParam.pageNum);
            this.getCheckoutNeedData()
          }
        }
      },
      getApiDetail(){
        this.axios.postForm('fieldConfig/getAllFieldList',
          {
            datasource:this.apiInfo.sourceProjectCode,
            tabName:this.apiInfo.tableName
          }).then((res)=>{
          this.allCheckIdList = res.content.map(item => item.id.toString())
          this.inputFieldList=[]
          this.outFieldList=[]
        })
      },
      getAllApi(val){

        if(val!=undefined){
          this.apiInfo.sourceProjectCode=val
        }
        this.axios.postForm("fieldConfig/getTabListByDatasource",{"datasource":this.apiInfo.sourceProjectCode}).then((res)=>{
          this.tabList = res.content;
        })

          },
      searchTabByDatasource(){
            if(this.tabList.indexOf(this.apiInfo.tableName)>-1){
              this.axios.postForm("fieldConfig/getFieldListByDatasourceAndTableName",{
                "datasource":this.apiInfo.sourceProjectCode,
                "tabName":this.apiInfo.tableName,
                "pageNum":this.pageParam.pageNum,
                "pageSize": this.pageParam.pageSize,
              }).then(res=>{
                this.show = true;
                this.data1 = res.content.list;
                this.pageParam.total = res.content.total
              })
            }else{
              this.$Message.error('当前数据源不存在该表')
            }
      },
      selectOne(id, param) {
        if(param == 'in'){
          if(this.inputFieldList.length == 0){
            this.inputFieldList.push(id)
          }else{
            if(this.inputFieldList.indexOf(id) >=0){
              this.inputFieldList = this.inputFieldList.filter(item => item != id)
            }else{
              this.inputFieldList.push(id)
            }
          }
          this.inAll = this.inputFieldList.length == this.allCheckIdList.length
        }else if(param == 'out'){
          if(this.outFieldList.length == 0){
            this.outFieldList.push(id)
          }else{
            if(this.outFieldList.indexOf(id) >=0){
              this.outFieldList = this.outFieldList.filter(item => item != id)
            }else{
              this.outFieldList.push(id)
            }
          }
          this.outAll = this.outFieldList.length == this.allCheckIdList.length
        }else{
          return null;
        }
      },
      selectAll(params, pre, value) {

        if(pre == 'in'){
          this.inputFieldList = value ? [] : this.allCheckIdList
        }else if(pre == 'out'){
          this.outFieldList = value ? [] : this.allCheckIdList
        }else{
          return null
        }
        this.outAll = this.outFieldList.length == this.allCheckIdList.length

        this.inAll = this.inputFieldList.length == this.allCheckIdList.length

      },
      getinRef(index) {
        return "in"+((this.pageParam.pageNum-1)*this.pageParam.pageSize+index);
      },
      getoutRef(index) {
        return "out"+((this.pageParam.pageNum-1)*this.pageParam.pageSize+index);
      },
      getId(row){
        return row.id;
      },
      getInValue(row){

        return row.inputId==row.id;
      },
      getOutValue(row){
        return row.outputId==row.id;
      },
      submitUpdate() {
        if( this.outFieldList.join()==''){
         this.$Message.info('请选择输出字段')
        }else{
          let obj = {
            "id": this.$route.query.apiId,
            "apiType":this.apiInfo.apiType,
            "applicationId":this.$route.query.applicationId,
            "sourceProjectCode": this.apiInfo.sourceProjectCode,
            "apiMode": "0",
            "principalId": this.apiInfo.principalId,
            "status": this.apiInfo.status,
            "isInputAll": "0",
            "isOutputAll": "1",
            "imgUrl": "",
            "apiName": this.apiInfo.apiName,
            "apiDescription": this.apiInfo.apiDescription,
            "operationName":this.apiInfo.operationName,
            "operationPhone":this.apiInfo.operationPhone,
            "operationEmail":this.apiInfo.operationEmail,
            "tableName": this.apiInfo.tableName,
            "sqlId": "",
            "inputId":  this.inputFieldList.join(),
            "outputId": this.outFieldList.join(),
            "updateTime": ""
          }

          this.axios.post('apiManagement/updateApi', obj)
            .then((res) => {
              this.$Message.info(res.msg)
              this.getApiInfo(this.pageParam.pageNum);
            })
        }

      }
    }
  }
</script>

<style scoped>
  .w-40 {
    width: 80px;
    display: inline-block;
  }
  .mgt-20 {
    margin-top: 20px;
  }
  .bj-model {}
  /*.bj-model >>> .ivu-table{*/
  /*width: 1000px!important;*/
  /*}*/
  .page {
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
  .tt>>>.ivu-switch-checked {
    background-color: #202D40;
    border-color: #202D40;
  }
</style>
