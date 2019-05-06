<template>
  <div>
    <span class="fs-18">新建接口</span>
    <Tabs value="name1" class="mt-20">
      <TabPane label="标准模式" name="name1" class="bj-model">
        <div class="mgt-20"><span class="w-40">接口类型:</span>
          <Select v-model="apiInfo.apiKind" style="width:365px;margin-left: -3px;">
            <Option v-for="item in kindApi" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </div>
        <div class="mgt-20"><span class="w-40">应用类型:</span>
          <Select v-model="apiInfo.application" style="width:365px;margin-left: -3px;">
            <Option v-for="item in apiList" :value="item.applicationId" :key="item.applicationId">{{ item.appName }}</Option>
          </Select>
        </div>
        <!--<div class="mgt-20"><span class="w-40">接口路径:</span><Input v-model="apiInfo.apiUrl" placeholder="接口路径" style="width: 90%;" /></div>-->
        <div class="mgt-20"><span class="w-40">接口名称:</span><Input v-model="apiInfo.apiName" placeholder="接口名称" style="width: 90%;" /></div>
        <!--<div class="mgt-20"><span class="w-40">接口简称:</span><Input v-model="apiInfo.apiAlias" placeholder="接口简称" style="width: 90%;" /></div>-->
        <!--<div class="mgt-20"><span class="w-40">管理人员:</span>-->
          <!--<Select v-model="apiInfo.apiAuthor" style="width:365px;margin-left: -3px;">-->
            <!--<Option v-for="item in createList" :value="item.zgh" :key="item.name">{{ item.name }}-{{item.zgh}}</Option>-->
          <!--</Select>-->
        <!--</div>-->
        <!--<div class="mgt-20"><span class="w-40">运维人员:</span>-->
          <!--<Input v-model="apiInfo.apiOperation" placeholder="运维人员" style="width: 90%;" />-->
          <!--&lt;!&ndash;<Select v-model="apiInfo.apiOperation" style="width:365px;margin-left: -3px;">&ndash;&gt;-->
            <!--&lt;!&ndash;<Option v-for="item in createList" :value="item.zgh" :key="item.name">{{ item.name }}-{{item.zgh}}</Option>&ndash;&gt;-->
          <!--&lt;!&ndash;</Select>&ndash;&gt;-->
        <!--</div>-->
        <div class="mgt-20"><span class="w-40">运维人员姓名:</span><Input v-model="apiInfo.operationName" placeholder="运维人员姓名" style="width: 90%;" /></div>
        <div class="mgt-20"><span class="w-40">联系电话:</span><Input v-model="apiInfo.operationPhone" placeholder="联系电话" style="width: 90%;" /></div>
        <div class="mgt-20"><span class="w-40">邮箱:</span><Input v-model="apiInfo.operationEmail" placeholder="邮箱" style="width: 90%" /></div>
        <span class="w-40">接口描述:</span><Input type="textarea" :rows="4" v-model="apiInfo.apiDesc" placeholder="请输入一句话描述该接口" style="width: 90%;margin-top: 20px;" />
        <div style="height: 30px; border-bottom: 1px solid #f5f7fa;"></div>
        <div class="mgt-20">
            <span class="w-40">数据源:</span>
            <Select v-model="dataSource" style="width:365px;margin-left: -3px;" @on-change="searchTable">
              <Option v-for="item in dataList" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </div>
        <div class="mgt-20">
          <span class="w-40">接口表格:</span>
          <Select v-model="apiInfo.tableName" placeholder="请输入需要查询的表格名称" style="width: 40%;" filterable>
            <Option v-for="item in tabList" :value="item" :key="item">{{ item }}</Option>
          </Select>
          <!--<Input v-model="apiInfo.tableName" placeholder="请输入需要查询的表格名称" style="width: 40%;" />-->
          <Button type="primary"  style="margin-left: 20px;background-color: #202D40;border-color: #202D40" @click="getTableList">搜索</Button>
        </div>
        <div class="mgt-20" v-if="show"><Tag  closable @on-close="handleClose">{{apiInfo.tableName}}</Tag>
          <!--<Button type="primary" style="position:absolute;right: 124px;" @click="allFieldIn">全表输入</Button>-->
          <!--<Button type="primary" style="position: absolute;right: 22px;" @click="allFieldOut">全表输出</Button>-->
        </div>
        <div style="width: 99%">
          <Table v-if="show" border :columns="columns1" :data="data1">
            <template slot-scope="{ row, index }" slot="inaction">
              <Checkbox :label="getId(row)"  :ref="getinRef(index,row)" @click.native="selectOne(index,'in')" value=""></Checkbox>
            </template>
            <template slot-scope="{ row, index }" slot="outaction">
              <Checkbox :label="getId(row)"  :ref="getoutRef(index)" @click.native="selectOne(index,'out')"></Checkbox>
            </template>
          </Table>
          <Page v-if="show" :total="page.pageTotal" class="page" @on-change="pageHandler"/>
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
        fieldIds:[],
        show:false,
        inAll:false,
        outAll:false,
        out:'',
        in:'',
        // showTable:false,
        // showPage:false,
        page:{
          pageNum:1,
          pageSize:10,
          pageTotal:100
        },
        apiInfo:{
          tableName:'',
          apiUrl:'',
          apiName:'',
          apiAlias:'',
          apiAuthor:'',
          operationName:'',
          operationPhone:'',
          operationEmail:'',
          apiDesc:'',
          apiKind:'',
          tableLable: {
              out:[],
              int:[]
          }

        },
        kindApi:[
          {id:0,value:'实时接口'},
          {id:1,value:'批量接口'}
        ],
        columns1: [
          {
            title: '字段',
            key: 'fieldName',
            // width:200
          },
          {
            title: '字段类型',
            key: 'fieldType',
            // width:200
          },
          {
            title: '描述',
            key: 'fieldChinese',
            // width:300
          },
          {
            title:'输入',
            // width: 100,
            align: 'center',
            slot:'inaction',
            renderHeader:(h,params)=>{
              return h('checkbox',{
                props: {
                  // value:this.inAll,
                },
                style: {
                  marginLeft: '5px'
                },
                model: {
                  value: this.inAll,
                  callback: (value) => {
                    this.inAll = value;
                    this.selectAll(params,'in',this.inAll)
                  },
                },
                nativeOn: {
                  click: () => {

                  }
                }
              },'输入')
            }
          },
          {
            title: '输出',
            // width: 100,
            align: 'center',
            slot: 'outaction',
            renderHeader:(h,params)=>{
              return h('checkbox',{
                props: {
                  // value:this.outAll,
                },
                style: {
                  marginLeft: '5px'
                },
                model: {
                  value: this.outAll,
                  callback: (value) => {
                    this.outAll = value;
                    this.selectAll(params,'out',this.outAll)
                  },
                },
                nativeOn: {
                  click: () => {

                  }
                }
              },'输出')
            }
          }
        ],
        data1: [],
        dataSource:'',
        dataList:[],
        createList:[],
        tabList:[],
      }
    },


      created() {
      sessionStorage.setItem("in",this.fieldIds);
      sessionStorage.setItem("out",this.fieldIds);
    },
    mounted() {
      this.getAllUser();
      this.getAllDatasource();
      this.getImgUrl();
      this.getAllAPPlication();
      // this.apiInfo.application=this.$route.query.applicationid
    },
    methods: {
      getAllAPPlication(){
        this.axios.postForm('applicationManagement/getManageApplicationInfo',{})
          .then((res)=>{
            this.apiList=res.content
            this.apiInfo.application=this.$route.query.applicationid
            // this.getApplicationApi();
          })
      },
      pageHandler(item){
        this.page.pageNum = item;
        //获取数据
        this.searchTabByDatasource();
        this.getTableList()

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
          let ref = pre+((this.page.pageNum-1)*this.page.pageSize+value);
          if(this.$refs[ref]!=undefined){
            this.$refs[ref]._data.currentValue = true;
          }
        })
      },
      //检查是否全选中 在单选和回显的时候需要判断
      checkIsAllSelected(){
        //this.data1 sessionStorage
        let inCurrentPageFieldSelected = sessionStorage.getItem("in");
        let outCurrentPageFieldSelected = sessionStorage.getItem("out");
        let inArr = inCurrentPageFieldSelected.substr(1,inCurrentPageFieldSelected.length).split(',');
        let outArr = outCurrentPageFieldSelected.substr(1,outCurrentPageFieldSelected.length).split(',');

        let idsArr = [];
        this.data1.forEach(value => {
          idsArr.push(value.id.toString())
        })
        //只会在单选是生效
        // if(inArr.sort().toString()==idsArr.sort().toString()){
        //   this.inAll = true;
        // }
        // if(outArr.sort().toString()==idsArr.sort().toString()){
        //   this.outAll = true;
        // }

        let inItem = 0;
        let outItem = 0;
        idsArr.forEach(value => {
          inArr.forEach(inValue=>{
            if(value==inValue){
                inItem++;
            }
          })
          outArr.forEach(outValue=>{
            if(value==outValue){
              outItem++;
            }
          })
          if(inItem==idsArr.length){
            this.inAll = true;
          }
          if(outItem==idsArr.length){
            this.outAll = true;
          }
        })

      },
      handleClose () {
        this.show = false;
      },
      searchTable(){
        if(this.dataSource==''){
          this.$Message.warning('请先选择数据源');
        }else{
          this.searchTabByDatasource();
        }
      },
      selectOne(index,param){
        let ref = param+((this.page.pageNum-1)*this.page.pageSize+index);
        if(this.$refs[ref]._data.currentValue){
          if(param==='in'){
            this.inAll = false;
          }else if(param==='out'){
            this.outAll = false;
          }
          //删除sessionStorage元素
          let fields = sessionStorage.getItem(param);

          let fieldArr = fields.split(',');
          let item = -1;
          for (let i = 0; i < fieldArr.length; i++) {
            if (fieldArr[i] == this.$refs[ref].label) item = i;
          }
          if(item>-1){
            fieldArr.splice(item,1)
          }
          sessionStorage.setItem(param,fieldArr);
        }else{
          //存放sessionStorage元素
          let fields = sessionStorage.getItem(param);
          let fieldArr = fields.split(',');
          fieldArr.push(this.$refs[ref].label)
          sessionStorage.setItem(param,fieldArr)
          this.checkIsAllSelected();
        }
      },
      selectAll(params,pre,value){
        //获取当前页的条数，主要是最后一页特殊
        let largePageNum = parseInt(this.page.pageTotal / this.page.pageSize) +1;
        let s = this.page.pageSize;
        if(this.page.pageNum == largePageNum){
          s = this.page.pageTotal - ((this.page.pageNum-1)*this.page.pageSize);
        }
        if(value){
          //全选
          let fields = sessionStorage.getItem(pre);
          let fieldArr = fields.split(',');
          for(let i=0; i<s; i++){
            let ref = pre+((this.page.pageNum-1)*this.page.pageSize+i);
            this.$refs[ref]._data.currentValue = true;
            //将所有选中的值放到sessionStorage中 先查看sessionStorage中是否存在
            if(fieldArr.indexOf(this.$refs[ref].label.toString())<0){
              fieldArr.push(this.$refs[ref].label)
            }

          }
          sessionStorage.setItem(pre,fieldArr);
        }else{
          //取消
          let fields = sessionStorage.getItem(pre);
          let fieldArr = fields.split(',');
          for(let i=0; i<s; i++){
            let ref = pre+((this.page.pageNum-1)*this.page.pageSize+i);
            this.$refs[ref]._data.currentValue = false;
            if(fieldArr.indexOf(this.$refs[ref].label.toString())>-1){
              fieldArr.splice(fieldArr.indexOf(this.$refs[ref].label.toString()),1);
            }

          }
          sessionStorage.setItem(pre,fieldArr);
        }
        //每次都要清楚，in 和 out 是共用该数组的
        this.fieldIds = [];
      },
      getinRef(index,row){
        return "in"+((this.page.pageNum-1)*this.page.pageSize+index);
      },
      getoutRef(index){
        return "out"+((this.page.pageNum-1)*this.page.pageSize+index);
      },
      getId(row){
        return row.id;
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
      searchTabByDatasource(){
        this.axios.postForm("fieldConfig/getTabListByDatasource",{"datasource":this.dataSource}).then(res=>{

          if(res.code==="10000"){
            this.tabList = res.content;

          }
        })
      },
      getTableList(){
        if(this.tabList.indexOf(this.apiInfo.tableName)>-1){
          this.axios.postForm("fieldConfig/getFieldListByDatasourceAndTableName",{
            "datasource":this.dataSource,
            "tabName":this.apiInfo.tableName,
            "pageNum": this.page.pageNum,
            "pageSize": 10,
          }).then(res=>{
            this.show = true;
            this.data1 = res.content.list;
            this.page.pageTotal = res.content.total
            this.inAll = false;
            this.outAll = false;
            this.$nextTick(()=>{
              //处理回显 或者在给表格赋值之前 将是否选中赋值给表格data 表头全选需要另外处理
              let inFields = sessionStorage.getItem("in");
              let outFields = sessionStorage.getItem("out");
              let inFieldArr = inFields.substr(1,inFields.length).split(',');
              let outFieldArr = outFields.substr(1,outFields.length).split(',');
              this.selectEcho(inFieldArr,'in');
              this.selectEcho(outFieldArr,'out');
              this.checkIsAllSelected();
            },3000)

          })
        }else{
          this.$Message.error('当前数据源不存在该表')
        }
      },
      addApi(){

        if(sessionStorage.getItem('out')==''){
         this.$Message.info('请选择输出字段')
        }else{
          this.axios.post("apiManagement/crateApi",{
            "apiType":this.apiInfo.apiKind,
            "applicationId": this.apiInfo.application,
            "sourceProjectCode":this.dataSource,
            "apiMode":"0",
            "operationPhone":this.apiInfo.operationPhone,
            "operationEmail":this.apiInfo.operationEmail,
            "apiName":this.apiInfo.apiName,
            "apiDescription":this.apiInfo.apiDesc,
            "principalId":this.apiInfo.apiAuthor,
            "operationName":this.apiInfo.operationName,
            "tableName":this.apiInfo.tableName,
            "inputId":sessionStorage.getItem('in'),
            "outputId":sessionStorage.getItem('out'),
            "isInputAll":'',
            "isOutputAll":'',
            "imgUrl":'api_'+this.getImgUrl()
          }).then(res=>{
            if(res.code=="10000"){
              this.$Message.success(res.msg);
              // this.$router.push("/")
              // this.userParentMethod();
            }else{
              this.$Message.error(res.msg);
            }
          })
        }

      },
      //全表输入
      allFieldIn(){

      },
      //全表输出
      allFieldOut(){

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
