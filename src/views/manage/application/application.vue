<template>
  <div  >
    <div class="content">
      <div   style="height: 400px">
        <Row :gutter="24">
          <Col span="24" >
            <Card class="shadow fd" >
              <div style=" text-align: right;padding-right: 50px" class="father">
                <p style="position: absolute;left: 30px;font-size: 15px;font-weight: normal;margin-top: 5px">所有应用--访问量(次)</p>
                <div style="display: inline-block;height: 30px">
          <span v-for="(item,index) in year"
                :key="index"
                @click="choose(item,index)"
                style="font-weight: normal;padding:0 10px;border-right: 1px solid #666;cursor: pointer;"
                :class="[{addcolor:index==current},'table'+index]">
                  {{ item.label }}
          </span>
                  <button id="buttonId" style="display: none"></button>
                  <div style="font-weight: normal;margin-left: 10px;cursor: pointer;display: inline-block" @click="timeShow=true" v-show="!timeShow">自定义</div>
                  <div v-show="timeShow" style="display: inline-block">
                    <Date-picker transfer type="date" :value="value1" placeholder="开始时间" format="yyyy-MM-dd" style="width: 120px"  @on-change="getStartTime"></Date-picker>
                    <Icon type="ios-remove" size="20"/>
                    <Date-picker transfer type="date" :value="value2" placeholder="结束时间" format="yyyy-MM-dd" style="width: 120px"  @on-change="getendTime"></Date-picker>
                  </div>
                </div>
              </div>
              <div id="line" style="width:100%;z-index:9;height: 350px" ></div>
            </Card>
          </Col>
        </Row>
      </div>
      <div style="height: 270px">
        <Row :gutter="20">
          <Col span="8">
            <Card class="shadow fd" style="margin-top: 20px;height: 270px" >
              <span style="font-size: 15px;">应用接口数(个)</span>
              <div style="display: inline-block;float: right;margin-right: 10px;font-weight: normal">
                <!--<span style="" @click="getlightInterface" :class="{red:current1==0}">访问量</span>-->
                <!--<span style="padding-left: 7px" @click="mi_Interface" :class="{red:current1==1}">密度</span>-->
              </div>
              <div class="barStyle" v-bar style="font-weight: normal;font-size: 12px;" v-bind:style="scollHeight">
                <div>
                  <div  v-for="item in Interface" class="barRow">
                    <div style="height: 15px;float:left;width: 100px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                      {{item.app_name}}
                    </div>
                    <Progress :percent="~~100*item.num/allnum" hide-info style="width: 50%;float:left"  @click.native="_showApp(item.application_id,item.app_name)" />
                    <!--<Progress :percent="~~100*item.density/total" hide-info style="width: 50%;float:left" v-show="item.density!=undefined" @click.native="_findAppdetail(item.appid,item.appname,type=0)" />-->
                    <div style="float:left;margin-left: 10px">{{item.num}}</div>
                    <!--<div style="float:left" v-show="item.density!=undefined">{{item.density}}</div>-->
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span="8">
            <Card class="shadow fd" style="margin-top: 20px;height: 270px" >
              <span style="font-size: 15px;">{{firstApplicationName}}-接口访问量</span>
              <div style="display: inline-block;float: right;margin-right: 10px;font-weight: normal">
                <!--<span style="" @click="getlightInterface" :class="{red:current1==0}">访问量</span>-->
                <!--<span style="padding-left: 7px" @click="mi_Interface" :class="{red:current1==1}">密度</span>-->
              </div>
              <div class="barStyle" v-bar style="font-weight: normal;font-size: 12px;" v-bind:style="scollHeight">
                <div>
                  <div  v-for="item in apiInfo" class="barRow">
                    <div style="float:left;width: 100px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;height: 15px;">
                      {{item.api_name}}
                    </div>
                    <Progress :percent="~~100*item.total/total" hide-info style="width: 50%;float:left"  @click.native="_findAppdetail(item.api_id,item.api_name)" />
                    <!--<Progress :percent="~~100*item.density/total" hide-info style="width: 50%;float:left" v-show="item.density!=undefined" @click.native="_findAppdetail(item.appid,item.appname,type=0)" />-->
                    <div style="float:left;margin-left: 10px">{{item.total}}</div>
                    <!--<div style="float:left" v-show="item.density!=undefined">{{item.density}}</div>-->
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span="8">
            <Card class="shadow fd" style="margin-top: 20px;height: 270px">
              <span>{{titelName}}</span>
              <Button type="default" style="float: right;margin-top: -5px;margin-right: 20px;" @click="seeDetail" >查看明细</Button>
              <div  class="barRow">
                <div class="barRowName1 divStyle">
                <span style="color: #787878">管理人员</span>
                <span id="needNum1" style="color: #5faeff;padding-left: 20px">{{user}}</span>
                </div>
                <div class="barRowName1 divStyle">
                  <span style="color: #787878">运维人员</span>
                  <span id="needNum2" style="color: #f6d55f;padding-left: 20px">{{operation}}</span>
                </div>
                <!--<div class="barRowName1 divStyle" >-->
                <!--<span style="color: #787878">访问密度</span>-->
                <!--<span id="needNum5" style="color: rgb(23, 176, 135);padding-left: 20px">{{density}}</span>-->
                <!--</div>-->
                <div class="barRowName1 divStyle" >
                  <span style="color: #787878">创建时间</span>
                  <span id="needNum3" style="color: #c7c7c7;padding-left: 20px">{{shangxianTime}}</span>
                </div>
                <div class="barRowName1 divStyle">
                  <span style="color: #787878">接口状态</span>
                  <span id="needNum4" style="color: #82cec7;padding-left: 20px">{{apiStatus}}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>

  </div>
</template>

<script>
  import {initLineChart} from "../../../api/echart";

  export default {
    data() {
      return {
        current1:0,
        total:0,
        firstApplicationName:'',
        firstApplication:'',
        yearDate:'年',
        current:0,
        timeShow:false,
        year:[
          {
            value:'年',
            label:'年'
          },
          {
            value:'月',
            label:'月'
          },
          {
            value:'日',
            label:'日'
          },
        ],
        titelName:"所有应用",
        user:'',
        operation:'',
        shangxianTime:'',
        apiStatus:'',
        density:'',
        value1:'',
        value2:'',
        startTime:'',
        endTime:'',
        dataRange:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seriesData:[820, 932, 901, 934, 1290, 1330, 1320],
        Interface:[],
        apiInfo:[],
        allnum:0,
        whole:0,
        type:0,
        appId:'',
        name:'',
        system:[],
        height1:{
          height:'',
        },
        height2:{
          height:'',
        },
        height3:{
          height:'',
        },
        scollHeight:{
          height:''
        },
        dHeight:{
          height:''
        },
        start:0,
        end:100,
        size:0
      };
    },
    create(){

    },
    computed:{
      statue(){
        const {value1,value2}=this
        return{
          value1,
          value2
        }
      }
    },
    watch:{
      statue:{
        handler:function (val) {

          if(val.value1==''&&val.value2==''){
            document.getElementById("buttonId").click();
            this.timeShow=false
          }
        },
        deep:true
      },

    },
    mounted() {
      this.getHeight();
     this.getVisitInfo()



    this.getAplication()
    },
    methods: {
      renderTime(date) {
        let  dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },
      choose(item,index){
        this.current=index
        this.yearDate=item.value

        this.getVisitInfo()
      },
      _findAppdetail(id,name){

        this.appId=id
        this.titelName=name
      this.getApiDeTail()

      },
      getApiDeTail(){
        this.user=''
        this.operation=''
        this.shangxianTime=''
        this.apiStatus=''
        this.axios.postForm('apiManagement/getApiInfoCount',{apiId:this.appId})
          .then((res)=>{

            if(res.content!=undefined){
              this.user=res.content.principal_name
              this.operation=res.content.operation_name
              this.shangxianTime=this.renderTime(res.content.creation_time)
              this.apiStatus=res.content.status==0?'关闭':'开启'
            }

            // user:'',
            //   operation:'',
            //   shangxianTime:'',
            //   apiStatus:'',
          })
      },
      _showApp(id,name){
        this.firstApplication=id

        this.firstApplicationName=name
        this.getApiInfo()
      },
      seeDetail(){

        // let type=this.type
        this.$router.push({path:'/detailovew',query:{applicationId:this.firstApplication,apiId:this.appId,titelName:this.titelName}})
      },
      getHeight(){
        let height = window.document.body.offsetHeight-50;

        this.height1.height = height*0.06+'px';
        this.height2.height = height*0.41+'px';
        this.height3.height = height*0.38+'px';
        this.scollHeight.height = height*0.38-60+'px';
        this.dHeight.height = height*0.215+'px';

      },
      getStartTime(t){
        this.value1=t
        this.startTime=t
        this.getVisitInfo()
      },
      getendTime(m){
        this.value2=m
        this.endTime=m
        this.getVisitInfo()
      },
      getAplication(){
        this.axios.postForm('apiCount/getApplicationInfoAndApiNum',{})
          .then((res)=>{
            if(res.content.length!=0&&res.content!=undefined){
              this.Interface=res.content
              for(let i=0;i<this.Interface.length;i++){
                this.allnum+=this.Interface[i].num
              }

              this.firstApplication=this.Interface[0].application_id
              this.firstApplicationName=this.Interface[0].app_name
              this.getApiInfo()
            }

          })
      },
      getApiInfo(){
        this.total=0
        this.axios.postForm('apiCount/getAllApiAndCount',
          {applicationId:this.firstApplication})
          .then((res)=>{
              this.apiInfo=res.content
            if(res.content.length!=0){
              for(let i=0;i<this.apiInfo.length;i++){
                this.total+=this.apiInfo[i].total
              }
              this.appId=res.content[0].api_id
              this.titelName=res.content[0].api_name

            }else{
              this.appId=''
              this.titelName=''

            }
            this.getApiDeTail()
            // this._findAppdetail(this.Interface[0].application_id,this.Interface[0].app_name)

          })
      },
      getVisitInfo(){
        this.dataRange=[]
        this.seriesData=[]
        let obj={
          preDate:this.startTime,
          subDate:this.endTime,
          dateTip:this.yearDate
        }
        this.axios.postForm('apiCount/getAllApplicationCountByDate',obj)
          .then((res)=>{

            for(let i=0;i<res.content.length;i++){
              this.dataRange[i]=res.content[i].date
              this.seriesData[i]=res.content[i].num
            }
              initLineChart(document.getElementById("line"),{},this.dataRange,this.seriesData);

          })
      },

    },
    components: {}
  }
</script>

<style scoped >
  .content{
    /*display: flex;*/
    /*padding: 20px 0;*/
    /*height: 100%;*/
    max-width: 1200px;
    margin: auto;
  }

  .red{
    color: #2d8cf0;
  }
  .table2{
    border: none!important;
  }
  .father span{
  }
  .addcolor{
    color: #788cf5;
  }
  .data{
    padding-top: 15px;
    margin-bottom: 15px;
    color: #6c6f71;
    padding-left: 80px;
    width: 50%;
    font-family: 'Microsoft Yahei';
    font-size: 14px;
    font-weight: 600;
  }
  .number{
    margin-top: 20px;
    font-size: 16px;
  }
  .ft{
    background-size: 100%;
    padding-left:15px;
    padding-top:10%;
    cursor: pointer;
    margin-left: 60px;
    color: #fff;
  }
  .fd{
    background-size: 100%;
    cursor: pointer;
    /*margin-left: 20px;*/
  }
  .model1{
    color:#fff;
    height:100%;
    min-width: 220px;
    max-width: 300px;
  }
  .shadow{
    background-color: #fff;
    height:100%;
    -moz-box-shadow: 0px 2px 10px #ccc;
    -webkit-box-shadow: 0px 2px 10px #ccc;
    box-shadow: 0px 2px 10px #ccc;
  }
  .col3{
    height:48%;
    margin-top:20px;
  }

  .pt15{
    padding-top: 15px;
    background-color: #fff;
    padding-left: 15px;
  }
  .barStyle{
    width: 100%;
  }
  .barRow{
    width:100%;
    height:20px;
    margin-top:15px;
    cursor: pointer;
  }
  .barRowName1 {
    width: 100%;
    color: #000;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
  }
  .divStyle{
    border-bottom: 1px solid #c7c7c7;
    padding: 8px 10px;
    font-size: 15px;
  }
  .zo{
    z-index: 2;
  }
  .zi{
    z-index: 1;
  }
  it .ivu-progress-text{
    margin-left: 0px!important;
  }
  .overview{
    /*display: flex;*/
    /*padding: 20px 0;*/
    /*height: 100%;*/
   width: 1300px;
    margin: auto;
  }
  .ivu-layout >>> .second{
  background-color: red !important;
  }
</style>
