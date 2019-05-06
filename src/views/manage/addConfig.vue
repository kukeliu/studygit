<template>
    <div>

            <div class="content">
                <div class="main">
                    <div class="rightTitle">
                        <div>添加表字段</div>
                    </div>
                    <div class="mgt-20">
                        <span >数据源：</span>
                        <Select v-model="dataSource" style="width:200px;margin-left: -3px;" @on-change="changeValue">
                            <Option v-for="item in dataList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                      <span   style="margin-left: 20px">数据表：</span>
                      <div style="display: inline-block;height: 50px" class="tableStyle">
                        <Input  placeholder="请输入数据表" style="width:200px;margin-left: -3px;" v-model="tableName" @keyup.native="_mohu" @on-focus="_mohu" @on-blur="_fun"/>
                        <ul v-if="isShow">
                          <li v-for="item in brr"  :key="item" @click="choose(item)">{{ item }}</li>
                        </ul>
                      </div>

                      <!--<Select v-model="tableName" filterable style="width:200px;margin-left: -3px;" >-->
                        <!--<Option v-for="item in tableNameList" :value="item" :key="item">{{ item }}</Option>-->
                      <!--</Select>-->
                      <Button type="primary" @click="search" style="background-color: #202D40;border-color: #202D40;">查询</Button>
                      <Button type="primary" @click="reset" style="background-color: #202D40;border-color: #202D40;">重置</Button>
                    </div>
                    <!--<div class="mgt-20">-->
                        <!--<span class="w-40">接口表格:</span>-->
                        <!--<Input v-model="tableName" placeholder="请输入需要查询的表格名称" style="width: 40%;" />-->
                      <!--<Button type="primary" @click="reload" style="margin-top:20px;background-color: #202D40;border-color: #202D40;display: block">导入</Button>-->
                    <!--</div>-->
                  <div class="tableList">
                    <Row :gutter="40">
                      <Col span="12" >
                        <div style="">
                          <span style="display: inline-block;font-size: 15px;margin-bottom: 10px;margin-top: 15px;">未导入数据表</span>
                          <span style="display: inline-block;float: right">
                          <Button type="primary"style="background-color: #202D40;border-color: #202D40;" @click="DaoRU">
                            导入
                          </Button>
                        </span>
                        </div>
                        <Table border ref="selection" height="420" :columns="firTable" :data="tableData" @on-selection-change="chooseValue"></Table>
                      </Col>
                      <Col span="12" >
                        <div style="">
                          <span style="display: inline-block;font-size: 15px;margin-top: 15px;margin-bottom: 10px;">已导入数据表</span>
                          <span style="display: inline-block;float: right">
                          <Button type="primary" style="background-color: #202D40;border-color: #202D40;" @click="deleteValue">
                            删除
                          </Button>
                        </span>
                        </div>

                        <Table border ref="selection" height="420" :columns="shujuTable" :data="tableData1" @on-selection-change="_deValue"></Table>
                      </Col>
                    </Row>
                  </div>
                </div>

            </div>

    </div>
</template>
<script>
    import Wrapper from "../../components/wrapper1";

    export default {
        components: {Wrapper},
        data(){
            return{
              keyWords:'',
              isShow:false,
                dataSource:'',
                dataList:[],
              tableData:[],
              tableData1:[],
                tableName:'',
              tableNameList:[],
              shujuTable:[
                {

                  type: 'selection',
                  align: 'center',
                  width:60
                },
                {
                  title: '表名',
                  key: 'tableName'
                },
                {
                  title: '表中文名',
                  key: 'tableChineseName'
                },
              ],
              firTable:[
                {

                  type: 'selection',
                  align: 'center',
                  width:60
                },
                {
                  title: '表名',
                  key: 'table_name'
                },
                {
                  title: '表类型',
                  key: 'table_type'
                },
                {
                  title: '表中文名',
                  key: 'table_comment'
                },
                {
                  title: '表状态',
                  key: 'status'
                },
              ],
              valueChoose:[],
              deNum:[],
              brr:[]
            }
        },
        mounted() {
            this.getAllDatasource();
        },
      computed: {

      },
        methods:{
          reset(){
            this.tableName=''
            this.dataSource=''

          },
          choose(item){
            this.tableName=item
            // this.isShow=false

          },
          _fun(){
            setTimeout(()=>{
              this.isShow=false
            },500)

          },
          _mohu(){
            this.isShow=true

            let len = this.tableNameList.length;
            this.brr=[...this.tableNameList]
            let arr = [];
            for(let i=0;i<len;i++){
              //如果字符串中不包含目标字符会返回-1
              if(this.tableNameList[i].indexOf(this.tableName)>=0){
                arr.push(this.tableNameList[i]);
              }
            }
            this.brr=arr;

          },
            reload(){
                if(this.dataSource==''){
                    this.$Message.warning('请先选择数据源');
                }else{
                    this.importTabConfig();
                }
            },
          search(){
            this.isShow=false
            this.getExportData()
            this.getFirstTable()
          },
            importTabConfig(){
                this.axios.postForm("fieldConfig/importField",{
                    sourceProjectCode:this.dataSource,
                    tableName:this.tableName
                }).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                    }else{
                        this.$Message.error(res.msg)
                    }
                })
            },
            getAllDatasource(){
                this.axios.postForm("apiManagement/getAllDatasource",{}).then(res=>{
                    if(res.code==="10000"){
                        this.dataList = res.content;
                        this.dataSource=res.content[0];
                      this.getTableName()
                        this.getExportData()
                      this.getFirstTable()
                    }
                })
            },
          changeValue(val){

            this.getTableName()

          },
          chooseValue(selection){
              this.valueChoose=selection

          },
          _deValue(selection){
              this.deNum=selection
          },
              getTableName(){
              this.axios.postForm('fieldConfig/getTabListByCurrentDatasource',{datasource:this.dataSource})
                .then((res)=>{
                  // console.log(res.content)
                  // console.log(res.content.length)
                  if(res.content!=undefined){
                    this.tableNameList=res.content
                  }

                })
          },

          getExportData(){
              this.axios.postForm('fieldConfig/getTabListByDefaultDatasource',{datasource:this.dataSource})
                .then((res)=>{

                  this.tableData1=res.content

                })
          },
          getFirstTable(){
              this.axios.postForm('fieldConfig/getTabListByDatasourceAndTableName',
                {
                  datasource:this.dataSource?this.dataSource:'',
                  tableName:this.tableName
                })
                .then((res)=>{
                // console.log(res.content)
                  // console.log(typeof a)
                  // console.log(res)
                  // console.log(res.content.length)
                  if(res.content!=undefined){
                    this.tableData=res.content
                    for(let i=0;i<res.content.length;i++){
                      if(this.tableData[i].isload==0){
                        this.$set(this.tableData[i],'status','未导入')
                        this.$set(this.tableData[i],'_disabled',false)
                      }
                      if(this.tableData[i].isload==1){
                        this.$set(this.tableData[i],'status','已导入')
                        this.$set(this.tableData[i],'_disabled',true)
                      }
                      if(this.tableData[i].table_comment=='null'){
                        this.tableData[i].table_comment='无'
                      }
                    }
                  }


                })
          },
          DaoRU(){
              let arr= new Array();
              for(let i=0;i<this.valueChoose.length;i++){
                  arr.push(this.valueChoose[i].table_name)
              }

            this.$Modal.confirm({
              title: '是否确认导入',
              onOk: () => {
                let obj = {
                  datasource: this.dataSource,
                  tabList: JSON.stringify(arr)
                }
                if(this.valueChoose.length==0){
                  this.$Message.info('必选一个')
                }else{
                  this.axios.postForm('fieldConfig/importTableField', obj)
                    .then((res) => {

                      if (res.code == '10000') {
                        this.$Message.info(res.msg)
                        this.getFirstTable()
                        this.getExportData()
                        this.valueChoose=[]
                      }

                    })
                }

              }
            })
          },
          deleteValue(){
            let arr= [];
            for(let i=0;i<this.deNum.length;i++){
              arr.push(this.deNum[i].tableName)
            }

            let obj={
              datasource:this.dataSource,
              tableNameList:JSON.stringify(arr)
            }
            if(this.deNum.length==0){

              this.$Message.info('必选一个')
            }else{
              this.$Modal.confirm({
                title: '是否确认删除',
                onOk: () => {
                  let obj={
                    datasource:this.dataSource,
                    tableNameList:JSON.stringify(arr)
                  }
                  this.axios.postForm('fieldConfig/deleteTableField',obj)
                    .then((res)=>{
                      if(res.code=='10000'){
                        this.$Message.info(res.msg)
                        this.getFirstTable()
                        this.getExportData()
                        this.deNum=[]
                      }else{
                        let arr=[]
                        if(obj.hasOwnProperty('res.content')==false){
                          arr=res.content
                          arr=arr.join()
                          this.$Message.error({
                            content: '该'+arr+'表已经被接口引用，删除失败',
                            duration: 5
                          });
                        }else{
                          this.$Message.error(res.msg);
                        }
                      }
                    })
                },
              });
            }


          }

        }
    }
</script>
<style scoped>
  .tableStyle{
    position: relative;
  }
  .tableStyle ul{
    width: 200px;
    max-height: 130px;
    overflow-y: scroll;
    border: 1px solid #edeef0;
    /*padding: 10px;*/
    margin-left: -3px;
    position: absolute;
    z-index: 101;
    background-color: white;
  }
  .tableStyle ul li{
    list-style: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .tableList{
    margin-top: 30px;
  }
    .rightTitle{
        border-bottom: 1px solid #dadfe6;
        padding-bottom: 10px;
        font-size: 18px;
        color: #202d40;
        letter-spacing: 0;
        line-height: 24px;
    }
    .mgt-20{
        margin-top: 20px;
    }
    .w-40{
        width: 80px;
        display: inline-block;
    }
    .content{
        display: flex;
        /*padding: 20px 0;*/
        height: 100%;
        max-width: 1200px;
        margin: auto;
    }
    .main{
        flex: 1;
        padding: 30px 30px 50px;
        background: #fff;
        height: 100%;
        min-height: 700px;
    }
</style>
