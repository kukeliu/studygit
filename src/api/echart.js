var echarts = require('echarts');
export function initLineChart(dom,option,Xdate,Sdate){
  var myChart = echarts.init(dom);
  let options={
    color:['#788cf5'],
    title: {
      // text: '所有应用 / 系统',
      textStyle: {
        //	color: '#333',
        fontWeight: 'bold',
        //		fontFamily: 'sans-serif',
        fontSize: 14,
      },
//				left: 30,
    },
    tooltip: {
      trigger: 'item',
      formatter: '日期：{b}<br />访问量：{c}',
      backgroundColor: '#788cf5',
      position:'top'
    },
    grid:{
      left:75,
      right: 60,
      bottom:60,
      top:30
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        startValue: 0,
        endValue: 100,
        //           fillerColor: 'rgba(63,167,220,0.5)',//'rgba(241,81,81,0.6)'
        handleStyle: {
          color: '#ffffff'
        },
        bottom: '5'
      }
    ],
    xAxis:  {
      type: 'category',
      boundaryGap:false,
      //		boundaryGap: [15,15],
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#eee']
        }
      },
      axisTick: {
        show: false,
      },
      data:Xdate
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: ['#eee']
        }
      },
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      // interval: 300,//通过与max，min值配合，强制将刻度划分段（如（max=2000）/（interval=400）=5段）
      min:0,
      // max:1500,

    },
    series: [
      {
        name:'访问量',
        type:'line',
        symbol: 'emptyCircle',
        symbolSize: 8,
        itemStyle: {
          normal: {
            borderWidth: 3
          }
        },
        lineStyle: {
          normal: {
            width: 3
          }
        },
        markPoint: {
          data: [
            {
              type: 'max',
              name: '最大值',
              symbolSize:50
            }
          ]
        },
        data:Sdate
      }
    ]
  }
  let p = Object.assign({}, options, option);
  myChart.setOption(p);
}
export function drawLine(dom,type,xAxisData,seriesData,spiltNum,max,t) {
  let _this = t
  var myChart = echarts.init(dom);
  let optionLine1 = {
    color:['#788cf5'],
    title: {
      text: '月分布趋势--访问量（次）',
      textStyle: {
        //	color: '#333',
        fontWeight: 'bold',
        //		fontFamily: 'sans-serif',
        fontSize: 14,
      },
//				left: 30,
    },
    tooltip: {
      trigger: 'item',
      formatter: '日期：{b}<br />访问量：{c}',
      backgroundColor: '#788cf5',
      position:'top'
    },
    grid:{
      left: 55,
      right: 60,
      bottom:60
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        startValue: 0,
        endValue: 9,
        //           fillerColor: 'rgba(63,167,220,0.5)',//'rgba(241,81,81,0.6)'
        handleStyle: {
          color: '#ffffff'
        },
        bottom: '5'
      }
    ],
    xAxis:  {
      type: 'category',
      boundaryGap:false,
      //		boundaryGap: [15,15],
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#eee']
        }
      },
      axisTick: {
        show: false,
      },
      data: []
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: ['#eee']
        }
      },
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      interval: 300,//通过与max，min值配合，强制将刻度划分段（如（max=2000）/（interval=400）=5段）
      min:0,
      max:1500,

    },
    series: [
      {
        name:'访问量',
        type:'line',
        symbol: 'emptyCircle',
        symbolSize: 8,
        itemStyle: {
          normal: {
            borderWidth: 3
          }
        },
        lineStyle: {
          normal: {
            width: 3
          }
        },
        markPoint: {
          data: [
            {
              type: 'max',
              name: '最大值',
              symbolSize:70
            }
          ]
        },
        data:[]
      }
    ]
  };

  if(type=="type2"){
    //赋给饼图option新数据，并加载
    optionLine1.title.text = '月分布趋势--访问人数（人）';
    optionLine1.color = ['rgb(95, 174, 255)'];//['rgb(95, 174, 255)']
    optionLine1.tooltip.backgroundColor = 'rgb(95, 174, 255)';
    optionLine1.tooltip.formatter = '日期：{b}<br />访问人数：{c}/人';
    optionLine1.series[0].name = "访问人数";
  }else{
    //赋给饼图option新数据，并加载
    optionLine1.title.text = '月分布趋势--访问量（次）';
    optionLine1.color = ['rgb(95, 174, 255)'];//['rgb(95, 174, 255)']#788cf5
    optionLine1.tooltip.backgroundColor = '#788cf5';
    optionLine1.tooltip.formatter = '日期：{b}<br />访问量：{c}/次';
    optionLine1.series[0].name = "访问量";//系列名
  }

  optionLine1.dataZoom[0].startValue = xAxisData.length-11;
  optionLine1.dataZoom[0].endValue = xAxisData.length-1;
  if(max>0){
    optionLine1.yAxis.interval = spiltNum;//重新赋予yAxis的interval值
    optionLine1.yAxis.max = spiltNum*5;//重新赋予yAxis的max值（spiltNum*5：一共5段）
  }else{
    optionLine1.yAxis.interval = 100;
    optionLine1.yAxis.max = 500;
  }
  optionLine1.xAxis.data = xAxisData;//重新赋予xAxis的data值
  optionLine1.series[0].data = seriesData;//重新赋予series的data值
  myChart.setOption(optionLine1); //重加载折线图

  var temp = _this.titelName;
  if(_this.titelName==="接口参数"){
    temp = "访问量";
  }

  myChart.on('click', function (params) {
    //传值，右边折线图line2根据不同年份联动
    _this.yearMon = params.name;
    //柱状图重加载
    if(_this.yearMon!="最大值"){
      _this.titelName = "("+_this.yearMon+"月)"+temp;
      _this.url = "/datahublog/findAppAccessInterface";
      var url1 = "/datahublog/findBarDataByMon";
      _this._getBarAjaxData(url1);
    }
  });

}

export function lineBar(dom,data) {
  var myChart = echarts.init(dom);
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
      data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],

      axisTick: {show: false}
    }],
    yAxis: [{
      name: '访问次数/次',
      min: 0,
      //       max:100,
      axisTick: {show: false},
      splitLine: {show: false},//去除网格线
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
      {
        name: '访问人数/人',
        min: 0,
        axisTick: {show: false},
        //       max:100,
        splitLine: {show: false},//去除网格线
        nameLocation: 'end',
        type: 'value',
        inverse: false
      },

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
      {
        name: '访问人数',
        yAxisIndex: 1,
        type: 'line',
        symbol: 'emptyCircle',
        symbolSize: 8,
        itemStyle: {
          normal: {
            borderWidth: 3,
            color: '#14a0f3'
          }
        },
        lineStyle: {
          normal: {
            width: 3
          }
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
      }]
  };
  option1.series[0].data = data.bar;
  option1.series[1].data = data.line;
  myChart.setOption(option1);
}
