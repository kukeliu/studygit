<template>
    <div class="tableShow">
        <div>
            <div class="rightTitle">
                <div>{{rightTitle}}({{currentNum}})</div>
            </div>
          <div style="margin-bottom: 20px;margin-top: 10px">
            <Select v-model="kind" style="width:200px;" @on-change="chooseApplication">
              <Option v-for="item in appList" :value="item.applicationId" :key="item.applicationId">{{ item.appName }}</Option>
            </Select>
          </div>
          <div>
            <Table  :columns="columns1" :data="data1" style="margin-top: 20px" ></Table>
            <Page :total="total" :page-size="pageSize" :current="pageNum"
                  @on-change="handlePage" @on-page-size-change="handlePageSize" show-total
                  style="margin-top: 20px;float: right"/>
          </div>

            <!--<Input v-model="interfaceParam" placeholder="筛选接口" style="width: auto" class="search" @on-enter="search">-->
                <!--<Icon type="ios-search" slot="suffix" @click.native="search"/>-->
            <!--</Input>-->
            <!--<br>-->
            <!--<div v-for="item in apiLists" style="display: inline-block;margin-right: 60px;">-->
                <!--<div style="padding: 20px;" class="card-api" @click="apiDetail(item)">-->
                    <!--<div class="hv">-->
                        <!--<div class="icon-1 dp-ib">-->
                          <!--<img :src="imgUrl(item.imgUrl)" class="icon-1"/>-->
                        <!--</div>-->
                        <!--<div class="dp-ib tt-desc">-->
                            <!--<div class="tt">{{item.apiName}}</div>-->
                            <!--<div class="desc">{{item.apiDescription}}</div>-->
                        <!--</div>-->

                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->

        </div>
    </div>
</template>

<script>

  let zgh=sessionStorage.getItem('zgh')

    export default{
        // inject:  ['reload'],
        components: {
        },
        data() {
            return {
              kind:'',
              appList:[],
                rightTitle:'',
                currentNum:'',
                apiLists:[],
              interfaceParam:'',
              copyArr:[],
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
                // {
                //   title:'使用状态',
                //   key:'useStatus'
                // },
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
                {
                  title:'操作',
                  key:'action',

                  render:(h,params)=>{
                    return h('div',[
                      h('img',{
                        attrs: {
                          title:'测试接口'
                        },
                        domProps:{
                          align: 'center',
                          src:require('../../assets/interface.png')
                        },
                        style: {
                          marginRight: '4px',
                          cursor: 'pointer',
                          width:'29%',
                          display:(this.rightTitle=='已申请的'&&params.row.sqlId==1&&params.row.status==1)?'inline-block':'none'
                        },
                        on: {
                          click: () => {
                            // console.log(params)
                            this.$router.push({path:'/test',
                              query:{applicationId:this.kind,
                                id:params.row.id,status:params.row.apiType,
                                rightTitle:this.rightTitle,
                                apiName:params.row.apiName,
                            }})

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
                          marginRight: '4px',
                          cursor: 'pointer',
                          width:'29%',
                          display:(this.rightTitle=='已申请的'&&params.row.sqlId==0||params.row.status==0)?'inline-block':'none'
                        },
                      }),
                      h('img',{
                        attrs: {
                          title:'申请'
                        },
                        domProps:{
                          align: 'center',
                          src:require('../../assets/shenqing.png')
                        },
                        style: {
                          marginRight: '4px',
                          cursor: 'pointer',
                          width:'28%',
                          display:(this.rightTitle=='所有接口'&&params.row.spareField1==0)?'inline-block':'none'
                        },
                        on: {
                          click: () => {
                              this.submitApplication(params)
                            // this.$router.push({path:'/test'})

                          }
                        }
                      }),
                      h('img',{
                        attrs: {
                          title:'申请'
                        },
                        domProps:{
                          align: 'center',
                          src:require('../../assets/hasappl.png')
                        },
                        style: {
                          marginRight: '4px',
                          cursor: 'pointer',
                          width:'28%',
                          display:(this.rightTitle=='所有接口'&&params.row.spareField1==1)?'inline-block':'none'
                        },
                        on: {
                          click: () => {
                            this.$Message.warning('该接口已经申请过');
                            // this.$router.push({path:'/test'})

                          }
                        }
                      }),
                      h('img',{
                        attrs: {
                          title:'查看文档'
                        },
                        domProps:{
                          align: 'center',
                          src:require('../../assets/doc.png')
                        },
                        style: {

                          cursor: 'pointer',
                          width:'28%'
                        },
                        on: {
                          click: () => {
                            console.log(params)
                            this.$router.push({
                              name:'apiDoc',
                              query:{
                                id:params.row.id,
                                apiName:params.row.apiName
                              }
                            })

                          }
                        }
                      }),
                    ])
                  }
                }
              ],
              data1:[],
              total:0,
              pageNum:1,
              pageSize:5,
            }
        },
      inject:['reload1','getApiNum'],
        created() {
        },
        mounted() {
            this.getParams();
          sessionStorage.setItem("",JSON.stringify(this.apiLists))
            this.getApi();

        },
        methods: {
          chooseApplication(){
            this.axios.postForm('apiUserManagement/getApiByApplicationPage',{
              "titleMessage":this.rightTitle,
              "pageNum":this.pageNum,
              "pageSize":this.pageSize,
              "applicationId":this.kind
            }).then((res)=>{

                // console.log(res.content.list)
                this.data1=res.content.list
                this.total=res.content.total
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


            })
          },
            getApi(){

                this.axios.postForm("apiUserManagement/getApiInfo",{
                    "titleMessage":this.rightTitle,
                  "pageNum":this.pageNum,
                  "pageSize":this.pageSize
                }).then(res=>{
                  // console.log(res.content.apiList)
                  if(res.content.apiList!=null) {
                    if (res.code == "10000") {
                      this.data1 = res.content.apiList.list

                      this.kind = res.content.firstApplication.applicationId
                      this.total = res.content.apiList.total
                      for (let i = 0; i < this.data1.length; i++) {
                        if (this.data1[i].apiType == 0) {
                          this.$set(this.data1[i], 'alternateFieldTwo', '实时接口')

                        }
                        if (this.data1[i].apiType == 1) {
                          this.$set(this.data1[i], 'alternateFieldTwo', '批量接口')
                        }
                        if (this.data1[i].status == 0) {
                          this.$set(this.data1[i], 'apiStatus', '关闭')

                        }
                        if (this.data1[i].status == 1) {
                          this.$set(this.data1[i], 'apiStatus', '开启')
                        }
                      }
                      this.appList = res.content.applicationList
                      // this.apiLists = res.content;
                      // this.copyArr=JSON.parse(JSON.stringify(this.apiLists))
                    }
                  }
                })
            },
            getParams(){
              this.rightTitle = this.$route.query.rightTitle;

              this.currentNum = this.$route.query.currentNum;
            // if(this.rightTitle==undefined){
            //   window.location.reload()
            // }

            },
          handlePage(value){
            this.pageNum=value
            this.chooseApplication()
          },
          handlePageSize(value){
            this.pageSize=value
            this.chooseApplication()
          },
            // getAllapplication(){
            //   this.axios.postForm('applicationManagement/getAllApplication',{})
            //     .then((res)=>{
            //       this.appList=res.content
            //
            //       // this.kind=parseInt(this.$route.query.applicationId)
            //     })
            // },
          submitApplication(params){
            this.$Modal.confirm({
              title: '提交申请',
              // content: '<p>是否提交申请</p>',
              render: (h) => {
                return h('div',[
                h('Input', {
                  props: {
                    value: this.value,
                    autofocus: true,
                    rows:4,
                    type:"textarea",
                    placeholder: '请输入ip白名单'
                  },
                  on: {
                    input: (val) => {
                      this.value = val;
                      // console.log(this.value)
                    }
                  },

                }),
                  h('span', {
                    style: {
                      fontSize: '10px',
                      color: 'red'
                    },
                    on: {
                      click: () => {
                        console.log(params.row)
                      }
                    }
                  },
                    '单个ip白名单直接指定地址，例如192.168.0.1；' +
                    '多个ip白名单可以使用多种格式，例如192.168.0.1,192.168.0.2,192.168.0.3' +
                    '，或者192.168.0.*，或者192.168.0.1-192.168.0.3,一律使用英文逗号分隔')

              ])
              },
              onOk: () => {
                // console.log(this.value)
                // console.log(zgh)
                if(this.value==undefined||this.value==''){
                    this.$Message.warning('未输入ip白名单，不可提交申请')
                }else{
                  this.axios.post('apiUserManagement/submitApplyApi',{
                    "apiid": params.row.id,
                    "userId": zgh,
                    "useType": "",
                    "ip":this.value,
                    "applicationType":this.kind,

                  })
                    .then((res)=>{
                      this.$Message.success(res.msg);
                      this.chooseApplication()
                      this.getApiNum()
                    })
                }

              }
            });

          }
        }
    }
</script>

<style scoped>

    .content{
        display: flex;
        padding: 20px 0;
        height: 100%;
        max-width: 1200px;
        margin: auto;
    }
    .left{
        width: 220px;
        background: #fff;
        margin-right: 10px;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 220px;
        min-height: 850px;
    }
    .right{
        flex: 1;
        padding: 30px 30px 50px;
        background: #fff;
        height: 100%;
        min-height: 850px;
    }
    .lefttop{
        padding: 30px 30px 20px;
    }

    .my-all{
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        color: #202d40;
        padding:0 30px;
    }
    .my-all:hover{
        background-color:#F6F6F6;
    }
    .onf{
        background-color: #DADFE6;
    }
    .rightTitle{
        border-bottom: 1px solid #dadfe6;
        padding-bottom: 10px;
        font-size: 18px;
        color: #202d40;
        letter-spacing: 0;
        line-height: 24px;
    }
    .search{
        position: relative;
        margin-top: 10px;
        min-height: 21px;
    }
    .icon-1{
        width: 64px;
        height: 64px;
        border-radius: 2px;
        vertical-align: top;
    }
    .card-api{
        display: inline-block;
        cursor: pointer;
        position: relative;
        vertical-align: top;
        width: 350px;
        height: 104px;
        /*margin: 0 30px;*/
        border-bottom: 1px solid #f5f7fa;
    }
    .hv{

    }
    .card-api:hover{
        background-color: #F5F7FA;
    }
    .tt-desc{
        margin-top: 10px;
        margin-left: 20px;
        margin-bottom: 4px;
        width: 200px;
        height: 48px;
        line-height: 20px;
    }
    .tt{
        color: #202d40;
        font-size: 12px;
        width: 100%;
        display: inline-block;
    }
    .desc{
        font-size: 12px;
        color: #202d40;
        margin-top: 10px;
    }
    .dsnone{
        display: none;
    }
</style>
<style>
 /*.ivu-table td.demo-table-info-column span{*/
   /*text-overflow: ellipsis;*/
   /*-webkit-line-clamp: 3;*/
   /*overflow: hidden;*/
   /*white-space: nowrap;*/
  /*}*/
</style>
