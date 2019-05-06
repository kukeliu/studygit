<template>
    <div>

            <div class="content">
                <div class="main">
                    <div class="rightTitle">
                        <div>数据源配置</div>
                    </div>
                    <div class="mgt-20">
                        <Form :model="formItem" :label-width="115">
                            <FormItem label="数据库类型：">
                              <span class='otherstyle'></span>
                                <Select v-model="formItem.datasourceType" style="width: 90%">
                                    <Option value="mysql">mysql</Option>
                                    <Option value="oracle">oracle</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="连接名："><span class='otherstyle'>*</span>
                              <Input v-model="formItem.projectCode" placeholder="连接名(必填)" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="数据库IP地址："><span class='otherstyle'>*</span>
                              <Input v-model="formItem.ip" placeholder="数据库IP地址(必填)" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="数据库端口："><span class='otherstyle'>*</span>
                              <Input v-model="formItem.port" placeholder="数据库端口(必填)" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="服务名(oracle)："><span class='otherstyle'></span>
                              <Input v-model="formItem.datasourceService" placeholder="服务名" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="数据库名(mysql)："><span class='otherstyle'></span>
                              <Input v-model="formItem.datasourceName" placeholder="数据库名" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="用户名："><span class='otherstyle'>*</span>
                              <Input v-model="formItem.userName" placeholder="用户名(必填)" style="width: 90%"/>
                            </FormItem>
                            <FormItem label="密码："><span class='otherstyle'>*</span>
                              <Input type="password" v-model="formItem.password" placeholder="密码(必填)"style="width: 90%"/>
                            </FormItem>
                            <FormItem>
                              <Button type="primary" style="background-color: #202D40;border-color:#202D40;" @click="testConnection">测试连接</Button>
                              <Button type="primary" style="background-color: #202D40;border-color:#202D40;" @click="submit">确认提交</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>

    </div>
</template>

<script>

    import Wrapper from "../../components/wrapper1";
    export default{
        components: {Wrapper},
        data() {
            return {
                formItem: {
                    datasourceType:'mysql',
                    projectCode:'',
                    ip:'',
                    port:'',
                    datasourceName:'',
                    datasourceService:'',
                    userName:'',
                    password:''
                },
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            testConnection(){
              if(this.formItem.projectCode==''){
                this.$Message.warning('连接名不能为空')
              }else if(this.formItem.ip==''){
                this.$Message.warning('ip地址不能为空')
              }else if(this.formItem.port==''){
                this.$Message.warning('端口号不能为空')
              }else if(this.formItem.userName==''){
                this.$Message.warning('用户名不能为空')
              }else if(this.formItem.password==''){
                this.$Message.warning('密码不能为空')
              }else{
                this.axios.post("datasourceManagement/testConnectionToDatasource",this.formItem).then(res=>{
                  if(res.code=="10000"){
                    this.$Message.success(res.msg)
                  }else{
                    this.$Message.error(res.msg)
                  }
                })
              }


            },
            submit() {
              if (this.formItem.projectCode == '') {
                this.$Message.warning('连接名不能为空')
              } else if (this.formItem.ip == '') {
                this.$Message.warning('ip地址不能为空')
              } else if (this.formItem.port == '') {
                this.$Message.warning('端口号不能为空')
              } else if (this.formItem.userName == '') {
                this.$Message.warning('用户名不能为空')
              } else if (this.formItem.password == '') {
                this.$Message.warning('密码不能为空')
              } else {
                this.axios.post("datasourceManagement/addDatasource", this.formItem).then(res => {
                  if (res.code == "10000") {
                    this.$Message.success(res.msg)
                  } else {
                    this.$Message.error(res.msg)
                  }
                })
              }
            }
        }
    }
</script>

<style scoped>
  .otherstyle{
    color: red;
    width: 10px;
    display: inline-block;
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
