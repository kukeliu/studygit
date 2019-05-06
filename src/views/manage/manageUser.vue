<template>
    <div>
        <!--<wrapper>-->
            <div class="content">
                <div class="main">
                    <div class="tt">
                        管理接入方
                        <Tooltip placement="top" content="新增" style="float: right;margin-right: 40px;" @click.native="addConfig">
                            <Icon type="md-add-circle" />
                        </Tooltip>
                    </div>
                    <div style="padding-top: 5px; ">
                      <Input v-model="searchMessage" style="width: 200px;" @on-enter="search" placeholder="接口id/接口名称/申请人id">
                          <Icon type="ios-search" slot="suffix" @click.native="search"/>
                      </Input>
                      <Select v-model="shenheStatus" style="width:150px;" placeholder="请选择" @on-change="getApiUserList">
                        <Option v-for="item in statuslist" :value="item.id" :key="item.id">{{ item.name}}</Option>
                      </Select>
                      <Button type="primary"  style="background-color: #202D40;border-color: #202D40;" @click="reset">重置</Button>
                    </div>
                    <Table  :columns="columns1" :data="data1" style="margin-top: 20px;"></Table>
                    <Page :total="this.pageParam.pageTotal" class="page" @on-change="pageHandler" show-total/>
                </div>
            </div>
        <!--</wrapper>-->
        <Modal
                v-model="addPeople"
                title="新增接入方配置信息"
                :scrollable="true"
                :draggable="true"
                @on-ok="add"
                    >
            <Form :model="formItem" :label-width="95">
                <FormItem label="选择应用：" >
                    <Select v-model="formItem.applicationType" @on-change="changeSelectApplication">
                        <Option v-for="application in applicationList" :key="application.applicationId" :value="application.applicationId" placeholder="应用" >{{application.appName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择接口：">
                    <Select v-model="formItem.apiid" @on-change="changeSelectApi">
                        <Option v-for="api in apiList" :key="api.id" :value="api.id" placeholder="APIID" >{{api.apiName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="申请人工号：" >
                  <Input v-model="formItem.userId" placeholder="申请人工号" @on-blur="changeOperationInfo"/>
                </FormItem>
                <FormItem label="申请人电话：">
                  <Input v-model="formItem.phone"  placeholder="申请人电话"/>
                </FormItem>
                <FormItem label="申请人邮箱：">
                  <Input v-model="formItem.email"  placeholder="邮箱地址"/>
                </FormItem>
                <FormItem label="所属公司：">
                    <Input v-model="formItem.user" placeholder="公司名称"/>
                </FormItem>
                <!--<FormItem label="使用平台：">-->
                    <!--<Select v-model="formItem.useType">-->
                        <!--<Option value="移动端">移动端</Option>-->
                        <!--<Option value="PC端">PC端</Option>-->
                        <!--<Option value="其它">其它</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem label="IP：">
                <Input v-model="formItem.ip" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="多个ip之间用英文逗号隔开"></Input>
            </FormItem>
            </Form>
        </Modal>
      <Modal
        v-model="examine"
        title=""
        footer-hide
        width="300">
        <p style="text-align: center;font-size: 15px;margin: 20px 0 30px">是否审核通过?</p>
        <Row style="margin-bottom: 15px">
          <i-col span="6" style="margin-left:70px;">
            <i-button type="primary" @click="asyncOK">通过</i-button>
          </i-col>
          <i-col span="6" style="margin-left:5px;">
            <i-button type="primary" @click="asyncCancel">不通过</i-button>
          </i-col>
        </Row>

        <!--<p>是否审核通过</p>-->
      </Modal>
    </div>
</template>

<script>

    import Wrapper from '@/components/wrapper1.vue'
    export default{
        components: {
            Wrapper
        },
        data() {
            return {
              id:'',
              shenheStatus:'',
              statuslist:[
                {id:0,name:'待审核'},
                {id:1,name:'审核通过'},
                {id:2,name:'审核失败'},
              ],
              examine:false,
                addPeople:false,
                searchMessage:'',
                columns1: [
                    {
                        title: '接口id',
                        key: 'apiid'
                    },
                    {
                        title: '接口名称',
                        key: 'apiName'
                    },
                  {
                    title: '应用id',
                    key: 'applicationType'
                  },
                    {
                        title: '接入类型',
                        key: 'useType'
                    },
                  {
                    title: '申请人id',
                    key: 'userId'
                  },
                    {
                      title: '接入公司',
                      key: 'user'
                    },
                    // {
                    //     title: '应用类型',
                    //     key: 'applicationType'
                    // },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: 'IP',
                        key: 'ip',
                      className: 'demo-table-info-column',
                      render: (h, params) => {
                        //return h('定义的元素',{'元素的性质'},'元素的内容');

                        let url = '访问的地址'
                        return h('a', {
                         on:{
                           click:()=>{
                             this.updateIp(params)
                             console.log(params)
                           }
                         }
                        }, params.row.ip)
                      }
                    },
                  {
                    title:'审核状态',
                    key:'auditStatus'
                  },
                    {
                        title: '操作',
                        align:'center',
                        render: (h, params) => {
                                return h('div', [
                                    h('img', {
                                        attrs: {
                                            title:'复制'
                                        },
                                        domProps:{
                                            align: 'center',
                                            src:require('@/assets/copy.png')
                                        },
                                        style: {
                                            marginRight: '4px',
                                            cursor: 'pointer',
                                            width:'26%',
                                        },
                                        on: {
                                            click: () => {

                                                this.copy(params)
                                            }
                                        }
                                    }),
                                    h('img', {
                                        attrs: {
                                            title:'禁用'
                                        },
                                        domProps:{
                                            align: 'center',
                                            src:require('@/assets/nouse.png')
                                        },
                                        style: {
                                            marginRight: '5px',
                                            cursor: 'pointer',
                                            width:'26%',
                                            display:(params.row.apiStatus== "1"&&params.row.applyStatus == "1")?'inline-block':'none'
                                        },
                                        on: {
                                            click: () => {
                                                this.forbiddenApi(params)
                                            }
                                        }
                                    }),
                            h('img', {
                              attrs: {
                                title:'启用'
                              },
                              domProps:{
                                align: 'center',
                                src:require('@/assets/start1.png')
                              },
                              style: {
                                marginRight: '5px',
                                cursor: 'pointer',
                                width:'24%',
                                display:(params.row.apiStatus== "0"&&params.row.applyStatus == "1")?'inline-block':'none'
                              },
                              on: {
                                click: () => {
                                  this.startApi(params)
                                }
                              }
                            }),
                                  h('img', {
                                    attrs: {
                                      title:'审核'
                                    },
                                    domProps:{
                                      align: 'center',
                                      src:require('@/assets/start.png')
                                    },
                                    style: {
                                      cursor: 'pointer',
                                      width:'25%',
                                      display:(params.row.applyStatus == "0")?'inline-block':'none'
                                    },
                                    on: {
                                      click: () => {
                                        this.shenHe(params.row)
                                      }
                                    }
                                  }),
                                ]);
                        }
                    }
                ],
                data1: [],
                formItem:{
                    apiid:'',
                    apiName:'',
                    user:'',
                    useType:'',
                    applicationType:'',
                    phone:'',
                    email:'',
                    ip:'',
                    userId: '',

                },
                pageParam:{
                    pageNum: 1,
                    pageTotal:0,
                    pageSize:10,
                },
                loseInputMillsecs:1000,
                clocker:'',
                applicationList:[],
                apiList:[]
            }
        },
        created() {},
        mounted() {
            this.getApiUserList();
        },
        methods: {
          updateIp(param){
// console.log(param)
            this.$Modal.confirm({
              title: '是否确认修改ip',
              render: (h) => {
                return h('Input', {
                  props: {
                    value:param.row.ip,
                    autofocus: true,
                    placeholder: '请输入ip'
                  },
                  on: {
                    input: (val) => {
                      this.ip = val;
                    }
                  }
                })
              },
              onOk:()=>{
                this.axios.post('apiUserManagement/updateApiUser',{ip:this.ip,id:param.row.id})
                  .then((res)=>{
                    this.getApiUserList();
                    this.$Message.info(res.content)
                  })

              }
            })
          },
          changeOperationInfo(){
            this.axios.postForm('user/getUserInfoByZgh',{zgh:this.formItem.userId}).then((res)=>{
              this.formItem.phone=res.content.phone
              this.formItem.email=res.content.mailbox

            })
          },
          reset(){
              this.shenheStatus='';
              this.searchMessage=''
          },
            pageHandler(pageNum){
                this.searchMessage = '';
                this.pageParam.pageNum = pageNum;
                this.getApiUserList();
            },
            search(){
                this.getApiUserList();
            },
            addConfig(){
              this.formItem={
                apiid:'',
                  apiName:'',
                  user:'',
                  useType:'',
                  applicationType:'',
                  phone:'',
                  email:'',
                  ip:'',
                  userId: '',

              },
                this.addPeople = true;
                this.getApplicationListByUserId();
              // this.formItem = {}
            },
            add(){
            // console.log(this.formItem)
                this.axios.post("apiUserManagement/createApiUser",this.formItem).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                        this.getApiUserList();
                    }else{
                        this.$Message.error(res.msg)
                    }
                })
            },
            copy(params){

              this.formItem={}
              this.addPeople = true;
              params.row.applicationType=parseInt(params.row.applicationType)
              this.getApplicationListByUserId();
              this.changeSelectApplication(params.row.applicationType)
              params.row.apiid=parseInt(params.row.apiid)
              let obj2 = Object.assign({}, params.row);
                this.formItem =obj2

            },
            startApi(params){
                this.$Modal.confirm({
                    title: '启用',
                    content: '<p>是否启用该接口</p>',
                    onOk: () => {
                        this.updateApiUserStatus(params,"1");
                    },
                    onCancel: () => {
                    }
                });
            },
            updateApiUserStatus(params,status){
                this.axios.postForm("apiUserManagement/forbiddenApiUser",{
                    id:params.row.id,
                    status:status
                }).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                        this.getApiUserList();
                    }else{
                        this.$Message.error(res.msg)
                    }
                })
            },
            forbiddenApi(params){
                this.$Modal.confirm({
                    title: '禁用',
                    content: '<p>是否禁用该接口</p>',
                    onOk: () => {
                        this.updateApiUserStatus(params,"0");
                    },
                    onCancel: () => {
                    }
                });
            },
            changeSelectApplication(value){
                //获取应用下的所有接口列表

              if(value!=undefined){
                this.axios.postForm("apiManagement/getApiByApplication",{applicationId:value}).then(res=>{

                  if(res.code==="10000"){
                    this.apiList = res.content;
                  }else{
                    this.$Message.error(res.msg)
                  }
                })
              }

            },
            changeSelectApi(val){
              this.apiList.forEach((item)=>{
                if(item.id==val){
                  this.formItem.apiName=item.apiName
                }
                // if()
              })
            },
            // innerKeydown(){
            //     if (null == this.clocker) {
            //         this.clocker = setTimeout(this.getApi, this.loseInputMillsecs);
            //     }
            //     else    //连续击键，重新开始计时
            //     {
            //         clearTimeout(this.clocker);
            //         this.clocker = setTimeout(this.getApi, this.loseInputMillsecs);
            //     }
            // },
            async getApi(){

                if(this.formItem.apiid!=null){
                    await this.axios.postForm("apiManagement/getApiByApiId",{
                        apiId:this.formItem.apiid
                    }).then(res=>{
                        if(res.code=="10000"){
                            this.formItem = res.content;
                        }else{
                            this.$Message.info(res.msg)
                        }
                    })
                }

            },
            getApiUserList(){
                this.axios.postForm("apiUserManagement/getApiUserInfoByPage",{
                    searchMessage:this.searchMessage,
                    pageNum:this.pageParam.pageNum,
                    pageSize:this.pageParam.pageSize,
                  status:this.shenheStatus
                }).then(res=>{
                    if(res.code=="10000"){
                        this.pageParam.pageTotal = res.content.total;
                        this.data1 = res.content.list;
                        for(let i=0;i<this.data1.length;i++){
                          if(res.content.list[i].applyStatus==0){
                            this.$set(this.data1[i], "auditStatus", '待审核')

                          }
                          if(res.content.list[i].applyStatus==1){
                            this.$set(this.data1[i], "auditStatus", '审核通过')
                          }
                          if(res.content.list[i].applyStatus==2){
                            this.$set(this.data1[i], "auditStatus", '审核失败')

                          }
                        }

                    }
                })
            },
          shenHe(item){
              this.id=item.id
              this.examine=true
          },
          asyncOK(){
            this.axios.postForm('apiUserManagement/verifyApiApply',{status:1,id:this.id})
              .then((res)=>{
                if(res.code==='10000'){
                  this.$Message.info('审核通过')
                  this.examine=false
                  this.getApiUserList();
                }
              })
          },
          asyncCancel(){
            this.axios.postForm('apiUserManagement/verifyApiApply',{status:2,id:this.id})
              .then((res)=>{
                if(res.code==='10000'){
                  this.$Message.info('审核不通过')
                  this.examine=false
                  this.getApiUserList();
                }
              })
          },
            getApplicationListByUserId(){
              this.axios.postForm("applicationManagement/getManageApplicationInfo",{}).then(res=>{
                  if(res.code==="10000"){
                      this.applicationList = res.content;
                  }else{
                      this.$Message.error(res.msg)
                  }
              }).catch(error=>{
              })
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
    .main{
        flex: 1;
        padding: 30px 30px 50px;
        background: #fff;
        height: 100%;
        min-height: 700px;
    }
    .tt{
        border-bottom: 1px solid #dadfe6;
        padding-bottom: 10px;
        font-size: 18px;
        color: #202d40;
        letter-spacing: 0;
        line-height: 24px;
    }
    .page{
        float: right;
        margin-top: 20px;
    }
    .content /deep/ .ivu-table td.demo-table-info-column{
      color: #2891fb !important;
      cursor: pointer;
    }
</style>
<style>

</style>
