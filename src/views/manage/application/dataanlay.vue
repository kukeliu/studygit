<template>
  <div >
    <div class="content">
      <Row :gutter="24">
        <Col span="24" >
          <Card  class="shadow" >
            <div style="margin-top: 30px;margin-left: 70px;">
              <div style=" ">
                <label style="">应用：</label>
                <Select v-model="applicationValue" filterable  style="width:200px;margin-right: 15px;"
                        placeholder="应用名称" @on-change="getApplicationValue" ref="store" >
                  <Option v-for="item in applicationList" :value="item.applicationId" :key="item.applicationId">{{ item.appName}}/{{item.applicationId}}</Option>
                </Select>
                <label>接口：</label>
                <Select v-model="apiValue" filterable   style="width:200px;margin-right: 15px;"
                        placeholder="接口名称" @on-change="" ref="store" >
                  <Option v-for="item in apiList" :value="item.id" :key="item.id">{{ item.apiName}}</Option>
                </Select>
                <label style="">日期：</label>
                <Date-picker  type="date" @on-change="getStartTime" :value="Startvalue" placeholder="日期" format="yyyy-MM-dd" style="width: 200px;margin-right: 25px"  ></Date-picker>
                <Button type="primary" style="background-color: #202D40;border-color: #202D40;" @click.native="search" >查询</Button>

                <Button  type="primary" @click.native="reset" style="background-color: #202D40;border-color: #202D40;">重置</Button>
                <!--<Button shape="circle" icon="ios-cloud-download-outline" :to="BASE_URL+'/visitLog/download'" target="_blank">导出</Button>-->
              </div>
              <div   style="height: 558px">
                <Spin size="large" fix v-if="spinShow"></Spin>
                <div id="line" style="height: 558px;width: 100%;margin-top: 40px;"></div>
              </div>

            </div>
          </Card>
        </Col>
      </Row>
    </div>

  </div>
</template>

<script>

  var echarts = require('echarts');
  export default {
    inject:['chooseTitle'],
    data() {
      return {
        Startvalue:'',
        apiValue:'',
        spinShow: true,
        value:"",
        buttonSize: 'large',
        isInterface:true,
        name:"接口名称",
        interfaceList:[],
        applicationList:[],
        apiList:[],
        interfaceName:"",
        interfaceValue:"",
        applicationValue:"",
        value1:'',
        value2:'',
        time:[],
        visit:[],
        count:[],

      };
    },
    mounted() {
      // console.log(nowDate)
      this.Startvalue=this.getNowDate()
      this.value1=this.getNowDate()
      this._getAllApplication()
      this._getBarAndLineAjaxData();
    },
    methods: {
      getNowDate(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        return nowDate
      },
      getStartTime(s){
        this.Startvalue=s

      },
      _getAllApplication(){
        this.axios.postForm("applicationManagement/getAllApplication",{}).then(res=>{
          this.applicationList = res.content;

        })
      },
      _getApiList(){
        this.axios.postForm('apiManagement/getApiByApplication',{applicationId:this.applicationValue})
          .then((res)=>{
            // console.log(res.content.length)
            if(res.content.length!=0){
              this.apiList=res.content
            }else{
              this.apiList=res.content
              this.apiValue=''
            }

          })
      },
      searchList(query){
        let arr=[]
        if(this.query==''){
          this.applicationValue=''
        }
      },
      _getOption(){
        var option1 = {
          title: {
            text: '访问情况分布'
          },
          tooltip: {},
          dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
              type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              start: 0,      // 左边在 10% 的位置。
              end: 90         // 右边在 60% 的位置。
            }
          ],
          legend: {
            data: ['访问次数', '访问人数']
          },
          grid: {
            left: 30,
            right: 30,
            bottom: 50,
            containLabel: true
          },
          xAxis: [{
            splitLine: {show: false},//去除网格线
            data: [],

            axisTick: {show: false}
          }],
          yAxis: [{
            name: '访问次数/次',
            min: 0,
            axisTick: {show: false},
            splitLine: {show: false},//去除网格线
            boundaryGap: [0, '100%'],
          }
          ],
          series: [{
            name: '访问次数',
            type: 'bar',
            barCategoryGap: '50%',
            itemStyle: {
              normal: {color: '#af54f3'}
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  name: '最大值',
                  symbolSize: 70
                }
              ]
            },
            data: []
          },
            ]
        };
        return option1;
      },
      getApplicationValue(e){
        // console.log("change" + e)
        this.applicationValue=e
        this._getApiList()
      },
      _getBarAndLineAjaxData() {

        this.time=[];
        this.count=[];
        let obj={
          applicationId:this.applicationValue ? this.applicationValue : "",
          date:this.Startvalue ? this.Startvalue : "",
          apiId:this.apiValue ? this.apiValue : ""
        }
      this.axios.postForm('apiCount/getApplicationCountInfo',obj)
        .then((res)=>{
          for(let i=0;i<res.content.length;i++){
            this.time[i]=res.content[i].requesttime
            this.count[i]=res.content[i].total
          }
          let chart1 = echarts.init(document.getElementById('line'));
          document.getElementById('line').oncontextmenu = function () { return false; };
          var option1 = this._getOption();
          option1.xAxis[0].data=  this.time
          option1.series[0].data = this.count;//重新赋予series的data值
          // option1.series[1].data = this.count;//seriesDataLine;//重新赋予series的data值
          chart1.setOption(option1); //重加载柱状图折线图
          chart1.on('contextmenu', (params)=> {
            // console.log(this.value1)
            // console.log(this.Startvalue)
            this.$router.push({path:'/dataDetail',query:{date:this.Startvalue,
                time:params.name,application:this.applicationValue,apiId:this.apiValue}})
            // console.log(LOGOUT_URL)
            // console.log(LOGOUT_URL+'dataDetail')
           // window.location.href=LOGOUT_URL+'dataDetail'+
           //   '?date='+this.value1 + '&time='+params.name+
           //   '&application='+this.applicationValue+'&apiId='+this.apiValue;
            // this.$router.push({path:'',query:{date:this.value1,time:params.name,application:this.applicationValue}})
            this.chooseTitle({
              id:'2',name:'数据明细',resComponent:'/dataDetail'
            },2)
            }
          )
          this.spinShow=false
        })

      },
      search(){
        this._getBarAndLineAjaxData();
      },
      reset(){
        // this.interfaceValue = "";
        this.applicationValue =""
        this.apiValue=""
        this.Startvalue=""
        this.value1=""
        // this.value1= ""
        // this.Startvalue=""
        this.value2=""
        this._getBarAndLineAjaxData();
      }



    },
    components: {}
  }
</script>

<style scoped lang="less">
  .content{
    /*display: flex;*/
    /*padding: 20px 0;*/
    /*height: 100%;*/
    max-width: 1200px;
    margin: auto;
  }
  .butStyle {
    border-radius: 20px;
    background-color: #fff;
    color: #788cf5;
    font-size: 12px;
    padding: 2px 20px;
    border-color: #788cf5;
  }
  .shadow{
    background-color: #fff;
    height:100%;
    -moz-box-shadow: 0px 2px 10px #ccc;
    -webkit-box-shadow: 0px 2px 10px #ccc;
    box-shadow: 0px 2px 10px #ccc;
  }

</style>
<style>


</style>
