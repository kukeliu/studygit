<template>
    <div>
        <!--<wrapper>-->
            <div class="content">
                <div class="main">
                    <div class="tt">
                        用户管理
                        <!--<Tooltip placement="top" content="新增" style="float: right;margin-right: 40px;" @click.native="addConfig">-->
                            <!--<Icon type="md-add-circle" />-->
                        <!--</Tooltip>-->
                    </div>
                    <div style="padding-top: 5px; ">
                        <Input v-model="searchMessage" style="width: 200px;" @on-enter="search" placeholder="职工号/姓名">
                            <Icon type="ios-search" slot="suffix" @click.native="search"/>
                        </Input>
                    </div>
                    <Table :columns="columns1" :data="data1" style="margin-top: 20px;">
                    </Table>
                    <Page :total="this.pageParam.pageTotal" class="page" @on-change="pageHandler" show-total/>
                </div>
            </div>
        <!--</wrapper>-->
        <Modal
                v-model="addPeople"
                title="新增用户"
                :scrollable="true"
                :draggable="true"
                @on-ok="add"
        >
            <Form :model="formItem" :label-width="80">
                <FormItem label="职工：">
                    <Input v-model="formItem.employeeNumber" placeholder="职工号"></Input>
                </FormItem>
                <FormItem label="姓名：">
                    <Input v-model="formItem.contactName" placeholder="姓名"></Input>
                </FormItem>
                <FormItem label="所属单位：">
                    <Input v-model="formItem.company" placeholder="所属单位"></Input>
                </FormItem>
                <FormItem label="电话：">
                    <Input v-model="formItem.phone" placeholder="电话"></Input>
                </FormItem>
                <FormItem label="邮箱：">
                    <Input v-model="formItem.mailbox" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem label="微信：">
                    <Input v-model="formItem.wechatNumber" placeholder="微信"></Input>
                </FormItem>
                <FormItem label="QQ：">
                    <Input v-model="formItem.qqNumber" placeholder="QQ账号"></Input>
                </FormItem>
                <FormItem label="备用电话：">
                    <Input v-model="formItem.otherNumber" placeholder="备用电话"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal
                v-model="updatePeople"
                title="修改用户"
                :scrollable="true"
                :draggable="true"
                @on-ok="updateUser"
        >
            <Form :model="formItem" :label-width="80">
                <FormItem label="职工号：">
                    <Input v-model="formItem.employeeNumber" placeholder="职工号"></Input>
                </FormItem>
                <FormItem label="姓名：">
                    <Input v-model="formItem.contactName" placeholder="姓名"></Input>
                </FormItem>
                <FormItem label="所属单位：">
                    <Input v-model="formItem.company" placeholder="所属单位"></Input>
                </FormItem>
                <FormItem label="电话：">
                    <Input v-model="formItem.phone" placeholder="电话"></Input>
                </FormItem>
                <FormItem label="邮箱：">
                    <Input v-model="formItem.mailbox" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem label="微信：">
                    <Input v-model="formItem.wechatNumber" placeholder="微信"></Input>
                </FormItem>
                <FormItem label="QQ：">
                    <Input v-model="formItem.qqNumber" placeholder="QQ账号"></Input>
                </FormItem>
                <FormItem label="备用电话：">
                    <Input v-model="formItem.otherNumber" placeholder="备用电话"></Input>
                </FormItem>
            </Form>
        </Modal>
      <Modal
        v-model="autherUser"
        title="用户授权"
        @on-ok="autherUserauther">
        <CheckboxGroup v-model="role">
          <Checkbox :label="item.id" :key="item.id" v-for="item in roleList">{{item.roleName}}</Checkbox>
        </CheckboxGroup>
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
              role:[],
              roleList:[],
              autherUser:false,
                addPeople:false,
                updatePeople:false,
                searchMessage:'',
                columns1: [
                    {
                        title: '职工号',
                        key: 'employeeNumber'
                    },
                    {
                        title: '姓名',
                        key: 'contactName'
                    },
                    // {
                    //     title: '所属单位',
                    //     key: 'company'
                    // },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                    {
                        title: '邮箱',
                        key: 'mailbox'
                    },
                    // {
                    //     title: '微信',
                    //     key: 'wechatNumber'
                    // },
                    // {
                    //     title: 'QQ',
                    //     key: 'qqNumber'
                    // },
                    // {
                    //     title: '备用电话',
                    //     key: 'otherNumber'
                    // },
                    {
                        title: '操作',
                        align:'center',
                        render: (h, params) => {
                                return h('div', [
                                    // h('img', {
                                    //     attrs: {
                                    //         title:'修改'
                                    //     },
                                    //     domProps:{
                                    //         align: 'center',
                                    //         src:require('@/assets/update1.png')
                                    //     },
                                    //     style: {
                                    //         marginRight: '6px',
                                    //         cursor: 'pointer',
                                    //         width:'25%'
                                    //     },
                                    //     on: {
                                    //         click: () => {
                                    //             this.update(params)
                                    //         }
                                    //     }
                                    // }),
                                    // h('img', {
                                    //     attrs: {
                                    //         title:'删除'
                                    //     },
                                    //     domProps:{
                                    //         align: 'center',
                                    //         src:require('@/assets/delete1.png')
                                    //     },
                                    //     style: {
                                    //         marginRight: '7px',
                                    //         cursor: 'pointer',
                                    //         width:'25%'
                                    //     },
                                    //     on: {
                                    //         click: () => {
                                    //             this.delete(params)
                                    //         }
                                    //     }
                                    // }),
                                  h('img', {
                                    attrs: {
                                      title:'授权'
                                    },
                                    domProps:{
                                      align: 'center',
                                      src:require('@/assets/userauther.png')
                                    },
                                    style: {

                                      cursor: 'pointer',
                                      width:'20px'
                                    },
                                    on: {
                                      click: () => {
                                          // console.log(params)
                                        this.auther(params)
                                      }
                                    }
                                  }),
                                ]);

                        }
                    }
                ],
                data1: [],
                formItem:{
                    id:'',
                    employeeNumber:'',
                    contactName:'',
                    company:'',
                    phone:'',
                    applicationType:'',

                    mailbox:'',
                    wechatNumber:'',
                    qqNumber: '',
                    otherNumber: '',
                },
                pageParam:{
                    pageNum: 1,
                    pageTotal:0,
                    pageSize:10,
                },
                loseInputMillsecs:1000,
                clocker:'',
              roleName:'',
              str:''
            }
        },
        created() {},
        mounted() {
            this.getApiUserList();
            this.getAllUser()
        },
        methods: {
            pageHandler(pageNum){
                this.searchMessage = '';
                this.pageParam.pageNum = pageNum;
                this.getApiUserList();
            },
            search(){
                this.getApiUserList();
            },
            addConfig(){
                this.addPeople = true;
                this.formItem = {};
            },
            add(){
                this.axios.post("user/createUser",this.formItem).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                    }else{
                        this.$Message.error(res.msg)
                    }
                    this.getApiUserList();
                })
            },
            update(params){
                this.updatePeople = true;
                this.formItem = params.row;
            },
            updateUser(){
                this.axios.post("user/updateUser",this.formItem).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                    }else{
                        this.$Message.error(res.msg)
                    }
                    this.getApiUserList();
                })
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
            deleteUser(params){
                this.axios.post("user/deleteUser",params.row).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success(res.msg)
                    }else{
                        this.$Message.error(res.msg)
                    }
                    this.getApiUserList();
                })
            },
            delete(params){
                this.$Modal.confirm({
                    title: '删除',
                    content: '<p>确认删除用户'+params.row.contactName+'</p>',
                    onOk: () => {
                        this.deleteUser(params);
                    },
                    onCancel: () => {
                    }
                });
            },
            getApiUserList(){
                this.axios.postForm("user/getUserListPage",{
                    searchMessage:this.searchMessage,
                    pageNum:this.pageParam.pageNum,
                    pageSize:this.pageParam.pageSize,
                }).then(res=>{
                    if(res.code=="10000"){
                        this.pageParam.pageTotal = res.content.total;
                        this.data1 = res.content.list;
                    }
                })
            },
          auther(params){
              // console.log(params)
            this.role=[]
            this.str=''
            for(let i=0;i<params.row.roleList.length;i++){
              this.role[i]=parseInt(params.row.roleList[i].id)

            }
            this.roleName=params.row.employeeNumber

            this.autherUser=true
            // console.log(this.roleList)
          },
          getAllUser(){
              this.axios.postForm('user/getAllRole',{})
                .then((res)=>{
                  this.roleList=res.content
                })
          },
          autherUserauther(){
              for(let i in this.role){
                this.str+=this.role[i]+','
              }

              this.axios.postForm('user/authorRole',{roleId:this.str,userId:this.roleName})
                .then((res)=>{
                  this.getApiUserList();
                  this.$Message.info(res.msg)
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
</style>

