<template>
  <div id="login" :style="{height:height}">
    <Card id="login-card" shadow>
      <div id="login-card-content">
        <img src="../assets/logologo.png" width="160px" alt="">
        <span style="display: block;font-size: 16px;color: #84CDC2;">接口管理平台</span>
        <p slot="content" style="margin-top: 40px">
          <Input v-model="userName" size="large" class="login-input" placeholder="账号">
          <Icon :size="24" type="ios-contact" slot="prefix" />
          </Input>
          <Input v-model="password" type="password" size="large" class="login-input" placeholder="密码" style="margin-top: 20px;">
          <Icon :size="24" type="ios-lock" slot="prefix" />
          </Input>
          <Button @click="Login" class="login-submit" long style="margin-top: 20px">登录</Button>
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
  import {getToken} from '../constant/token'
  import {getZgh} from '../constant/token'
  import {getInfo} from '../constant/token'
  import {getInfo1} from '../constant/token'
  export default {
    components: {},
    data() {
      return {
        height: `${window.innerHeight}px`,
        userName:"",
        password:"",
      }
    },
    created() {},
    mounted() {

    },
    methods: {
      Login(){
          this.axios.postForm('user/login',{
            zgh:this.userName,
            password:this.password
          }).then((res)=>{
              if(res.code=='10000'){
                getToken(res.content.token)
                getZgh(this.userName)
                sessionStorage.setItem('xingming',res.content.userRole.contactName)

                  if(res.content.userRole.roleList.length>0){
                      getInfo1(res.content.userRole.roleList[0].roleName)
                      getInfo(res.content.userRole.roleList[1].roleName)

                      let roleList = new Array();
                      for(let role in res.content.userRole.roleList){
                        roleList[role]=res.content.userRole.roleList[role].roleCode;
                      }
                      if(roleList.indexOf("role_xt")>-1){
                          this.$router.push({path:'/apiList'})
                      }else{
                          this.$router.push({path:'/index'})
                      }
                  }else{
                      //默认跳转客户端
                      this.$router.push({path:'/index'})
                  }
                 /*if(res.content.userRole.roleList.length==2){
                   getInfo1(res.content.userRole.roleList[0].roleName)
                   getInfo(res.content.userRole.roleList[1].roleName)

                   if(res.content.userRole.roleList[0].roleName=='系统管理员'){
                     this.$router.push({path:'/apiList'})

                   }else {

                     this.$router.push({path:'/index'})

                   }
                 }else if(res.content.userRole.roleList.length==1){
                   if(res.content.userRole.roleList[0].roleName=='系统管理员'){
                     this.$router.push({path:'/apiList'})
                     // getInfo(res.content.userRole.roleList[0].roleName)
                   }else {
                     this.$router.push({path:'/index'})
                     // getInfo1(res.content.userRole.roleList[0].roleName)
                   }
                 }*/


              }else{
                this.$Message.error('用户名或密码错误')
              }
          })
      }
    }
  }
</script>
<style scoped>
  .login-input >>> input {
    height:50px;
    font-size: 16px;
    padding-left: 45px;
  }
  .login-input >>> .ivu-input-prefix {
    line-height: 48px;
    left: 10px;
  }
</style>

<style scoped >
  #login-card {
    width: 430px;
    height: 550px;
    margin: 0 auto;
    position: relative;
    top: 80px;
    border-radius: 10px;
    box-shadow: 0 10px 30px -6px rgba(0, 0, 0, 0.2);
  }
  #login-card-content {
    margin-top: 30px;
    padding: 0 30px;
    text-align: center;
  }
  .login-input {
    margin-top: 5px;
  }
  .login-submit {
    background: #6c8cbc;
    position: relative;
    color:#fff;
    //隐藏溢出的径向渐变背景
    overflow: hidden;
    /*top: 40px;*/
    line-height: 28px;
    height: 48px;
    font-size: 14px;
    transition: all 0.3s;
    /*&:hover {*/
    /*transform: scale(1.02);*/
    /*box-shadow: 0 5px 10px rgba(1,81,152, 0.8);*/
    /*}*/
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      //设置径向渐变
      background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform 0.3s, opacity 0.5s;
    }
    &:active:after {
      transform: scale(0, 0);
      opacity: 0.3;
      transition: 0s;
    }
  }




</style>
