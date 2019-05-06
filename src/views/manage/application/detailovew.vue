<template>
  <div>
<div class="content">
  <div style="height: 300px">
    <Row >

      <Col span="24">
        <!--<div class="shadow" id="echart" ref="accessLineEcharts"></div>-->
        <Card class="shadow" >
          <div style=" text-align: right;padding-right: 50px">
            <p style="position: absolute;left: 30px;font-size: 16px;font-weight: normal;margin-top: 5px">{{titelName}}日访问统计--访问量(次)</p>

            <i-select v-model="appId" style="width:100px;text-align: left" @on-change='apiChange'>
              <i-option v-for="item in apiInfo" :value="item.api_id" :key="item.api_id">{{ item.api_name }}</i-option>
            </i-select>
            <Date-picker type="date" :value="value3" placeholder="开始时间" format="yyyy-MM-dd" style="width: 120px"  @on-change="getStartTime"></Date-picker>
            <Icon type="ios-remove" size="20"/>
            <!--<span style="font-weight: normal">-&#45;&#45;</span>-->
            <Date-picker type="date" :value="value4" placeholder="结束时间" format="yyyy-MM-dd" style="width: 120px"  @on-change="getendTime"></Date-picker>

          </div>
          <div id="line" style="width:100%;z-index:9;height: 300px" ></div>
        </Card>

      </Col>

    </Row>
  </div>
  <div style="height: 300px">
    <Row :gutter="15">
      <Col span="12">
        <Card class="shadow" style="margin-top: 20px">
          <p style="left: 30px;font-size: 16px;font-weight: normal;">月访问统计--访问量(次)</p>

          <div id="line1" style="width:100%;z-index:9;height: 300px" ></div>
        </Card>
      </Col>
      <Col span="12">
        <!--<div class="shadow" id="echart" ref="accessLineEcharts"></div>-->
        <Card class="shadow" style="margin-top: 20px">
          <p style="left: 30px;font-size: 16px;font-weight: normal;">年访问统计--访问量(次)</p>

          <div id="line2" style="width:100%;z-index:9;height: 300px" ></div>
        </Card>

      </Col>

    </Row>
  </div>
</div>



  </div>
</template>

<script>
  import {initLineChart} from '../../../api/echart.js'

  export default {
    data() {
      return {
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
        apidetail:'',
        type:'',
        appId:'',
        value3:'',
        value4:'',
        startTime:'',
        endTime:'',
        yearDate:0,
        dataRange:[],
        seriesData:[],
        dataRange1:[],
        seriesData1:[],
        dataRange2:[],
        seriesData2:[],
        apiInfo:[],
        titelName:'',
        applicationId:''
      };
    },
    create(){

    },
    mounted() {
      if(this.$route.query.applicationId==''){
        this.applicationId=this.$route.query.applicationId
      }else{
        this.applicationId=parseInt(this.$route.query.applicationId)
      }
      if(this.$route.query.apiId==''){
        this.appId=this.$route.query.apiId
      }else{
        this.appId=parseInt(this.$route.query.apiId)
      }
      this.titelName=this.$route.query.titelName

      this.getHeight();
      this.getinterfaceInfo()
      this.getinterfaceInfo1()
      this.getinterfaceInfo2()
      this.getApiList()
    },
    methods: {
      getHeight(){
        let height = window.document.body.offsetHeight-50;
        this.height1.height = height*0.06+'px';
        this.height2.height = height*0.36+'px';
        this.height3.height = height*0.38+'px';
        this.scollHeight.height = height*0.38-60+'px';
        this.dHeight.height = height*0.215+'px';
      },
      getStartTime(t){
        this.startTime=t
        this.getinterfaceInfo()
        this.getinterfaceInfo1()
        this.getinterfaceInfo2()
      },
      getendTime(m){
        this.endTime=m
        this.getinterfaceInfo()
        this.getinterfaceInfo1()
        this.getinterfaceInfo2()
      },
      apiChange(val){

        this.appId=val
        this.getinterfaceInfo()
        this.getinterfaceInfo1()
        this.getinterfaceInfo2()
      },
      getApiList(){
        this.axios.postForm('apiCount/getAllApiAndCount',{applicationId:this.applicationId})
          .then((res)=>{

           this.apiInfo=res.content

          })
      },
      getinterfaceInfo(){
        this.dataRange=[];
        this.seriesData=[]
        let obj={
          preDate:this.startTime,
          subDate:this.endTime,
          dateTip:'日',
          applicationId:this.appId
        }

        this.axios.postForm('apiCount/getApplicationCountById',obj)
          .then((res)=>{

            for(let i=0;i<res.content.length;i++){
              this.dataRange[i]=res.content[i].date
              this.seriesData[i]=res.content[i].num
            }


            setTimeout(()=>{
              initLineChart(document.getElementById("line"), {},this.dataRange,this.seriesData
                );

            },1000)
          })
      },
      getinterfaceInfo1(){
        this.dataRange1=[];
        this.seriesData1=[]
        let obj={
          preDate:this.startTime,
          subDate:this.endTime,
          dateTip:'月',
          applicationId:this.appId
        }

        this.axios.postForm('apiCount/getApplicationCountById',obj)
          .then((res)=>{

            for(let i=0;i<res.content.length;i++){
              this.dataRange1[i]=res.content[i].date
              this.seriesData1[i]=res.content[i].num
            }


            setTimeout(()=>{
              initLineChart(document.getElementById("line1"), {},this.dataRange1,this.seriesData1
              );

            },1000)
          })
      },
      getinterfaceInfo2(){
        this.dataRange2=[];
        this.seriesData2=[]
        let obj={
          preDate:this.startTime,
          subDate:this.endTime,
          dateTip:'年',
          applicationId:this.appId
        }

        this.axios.postForm('apiCount/getApplicationCountById',obj)
          .then((res)=>{

            for(let i=0;i<res.content.length;i++){
              this.dataRange2[i]=res.content[i].date
              this.seriesData2[i]=res.content[i].num
            }


            setTimeout(()=>{
              initLineChart(document.getElementById("line2"), {},this.dataRange2,this.seriesData2
              );

            },1000)
          })
      },

    },
    components: {}
  }
</script>

<style scoped lang="less">
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
    /*height:47%;*/
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
    margin-left: 20px;
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
    /*width:100%;*/
    /*padding-left:15px;*/
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
    /*max-width: 200px;*/
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
    padding: 10px;
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
  .content{
    /*display: flex;*/
    /*padding: 20px 0;*/
    /*height: 100%;*/
    max-width: 1200px;
    margin: auto;
  }
</style>
