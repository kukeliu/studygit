<template>
    <Layout>
        <Header :style="{zIndex:10,lineHeight:`${toTop}px`,height:`${toTop}px`,position: 'fixed', width: '100%',background:'#fff','box-shadow': '-12px -9px 20px 0px #848484',padding:0,minWidth:'1300px'}">
            <Row >
                <i-col class="tl" span="7" style="position: relative;margin-left: 5%;">
                    <img style="vertical-align: middle;width: 35px;" src="@/assets/logologo.png" alt="接口管理" @click="manageIndex">
                    <h1 style="display: inline-block;">接口管理平台</h1>
                </i-col>
              <i-col span="1"  class="i-user" style="float: right;position: relative;margin-right: 4%;">

                <Dropdown  style="position: relative;">
                  <div style="display:inline-block;" class="user">
                    <a class="login-user" href="javascript:void(0)">
                      <img style="vertical-align: middle;" src="@/assets/user.png" alt="用户" />
                    </a>
                  </div>
                  <DropdownMenu slot="list">
                    <DropdownItem >{{userName}}</DropdownItem>
                    <DropdownItem divided to="/index" @click.native="pushClient" v-show="name=='role_pt'">客户端</DropdownItem>
                    <!--<DropdownItem to="/" @click.native="layout" >退出</DropdownItem>-->
                  </DropdownMenu>
                </Dropdown>
              </i-col>
                <i-col span="12"   class="i-user" style="position: relative;float: right;margin-right: 2%;">
<div style="position: relative;float: right;">
  <div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" :class="{'isShow':current=='/apiList'}" @click="manageIndex" title="首页">
    <img style="vertical-align: middle;width: 25px;height: 25px;text-align: center;" src="@/assets/main.png" alt="首页" />
  </div>
  <div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" ref="refName" :class="{'isShow':current=='/applicationWhole'}" @click="manageUser('/applicationWhole')" title="数据管理">
    <img style="vertical-align: middle;width: 25px;height: 25px;text-align: center;" src="@/assets/applicationApp.png" alt="数据管理" />
  </div>
  <div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" :class="{'isShow':current=='/addWhole'}" @click="manageUser2('/addWhole')" title="数据配置">
    <img style="vertical-align: middle;width: 25px;height: 25px;text-align: center;" src="@/assets/datasource.png" alt="数据配置" />
  </div>
  <!--<div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" @click="manageUser('/addConfig')"  title="表字段配置">-->
  <!--<img style="vertical-align: middle;width: 25px;height: 25px;text-align: center;" src="@/assets/fieldconfig.png" alt="表字段配置" />-->
  <!--</div>-->
  <div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" :class="{'isShow':current=='/manageUser'}" @click="manageUser1('/manageUser')"  title="管理接入方">
    <img style="vertical-align: middle;width: 25px;height: 25px;" src="@/assets/rolemanage.png" alt="管理接入方" />
  </div>
  <div style="width: 60px;height: 100%;display: inline-block;text-align: center;" class="mgl-200" :class="{'isShow':current=='/userConfig'}" @click="manageUser1('/userConfig')" title="用户管理">
    <img style="vertical-align: middle;width: 25px;height: 25px;text-align: center;" src="@/assets/usermanagement.png" alt="用户管理" />
  </div>
</div>

                </i-col>

            </Row>
        </Header>
        <Content :style="{margin: `${toTop}px 0 0`, background: '#F6F7FB', minHeight: `${minHeight-toTop}px`,minWidth:'1080px'}">
            <Row>
                <i-col span="22" offset="1" style="padding:16px 0">
                    <!--<slot></slot>-->
                  <router-view />
                </i-col>
            </Row>
        </Content>
    </Layout>
</template>

<script>
  import {getToken} from '../constant/token'
  // let access_token = 'Bearer' + ' ' + sessionStorage.getItem('token')
  export default {
    components: {},
      data() {
      return {
        toTop:55,
        minHeight:window.innerHeight,
        name:'',
        userName:'',
        current:'/apiList'
      }
    },
    mounted() {
      this.userName=sessionStorage.getItem('xingming')
      // console.log(this.$route)
      this.name=sessionStorage.getItem('info')
      // console.log(this.name)
        window.onresize = () => {
          this.minHeight = window.innerHeight
        }
       if(this.$route.path=='/application'||this.$route.path=='/dataanlay'||this.$route.path=='/dataDetail'){
          this.current='/applicationWhole'
        }
      else if(this.$route.path=='/datasourceConfig'||this.$route.path=='/addConfig'){
          this.current='/addWhole'
        }
     else if(this.$route.path=='/apiLists'){
        this.current='/apiList'
         }
         else{
         this.current=this.$route.path
       }

    },
    methods: {
      layout(){
        this.axios.postForm('user/logout',{})
          .then((res)=>{
            if(res.code=='10000'){
              sessionStorage.removeItem('token');
              sessionStorage.clear();
              // getToken(res.content)
              this.$router.push({path:'/'})
            }
          })
      },
        pushClient(){
            this.$router.push('/index')
        },
        manageUser(param){
          this.current=param
          if(this.$route.name != "dataanlay"
            &&this.$route.name !='dataDetail')
          {
            this.$router.push(param)

          }

        },
      manageUser1(param){
        this.current=param
        this.$router.push(param)


      },
      manageUser2(param){
        this.current=param
        if(this.$route.name != "addConfig"
        )
        {
          this.$router.push(param)

        }

      },
        manageIndex(){
          this.current='/apiList'
          // console.log()

          if(this.$route.name != "apiList"
            &&this.$route.name !='apiLists'
            &&this.$route.name !='apiType'
            &&this.$route.name !='apiDetail'
            &&this.$route.name !='testapi'
            &&this.$route.name !='addApplication'
            &&this.$route.name !='addApi'
          ){
            this.$router.push('/apiList')

          }

          // console.log(event.returnValue)

          // if(this.$route.name === "manageUser"){
          //   show = false;
          // }
          // // if(this.$route.name === "datasourceConfig"){
          // //   show = false;
          // // }
          // if(this.$route.name === "addWhole"){
          //   show = false;
          // }
          // // if(this.$route.name === "manageUser"){
          // //   show = false;
          // // }
          // if(this.$route.name === "userConfig"){
          //   show = false;
          // }
          // if(this.$route.name === "applicationWhole"){
          //   show = false;
          // }


              // if(show) this.$parent.onload()
          // if(this.$route.name=='apiList'){
          //   event.returnValue=false
          // }else{
          //   event.returnValue=true
          // }
            // this.$router.go('/')
        }
    },
  }
</script>

<style scoped>
    .mgl-240{
        margin-left: 10px;
    }
    .mgl-240:hover{
        background-color: #F5F7FA;
    }
    .isShow{
      background-color: #F5F7FA !important;
    }
    .mgl-200{
    }
    .mgl-200:hover{
        background-color: #F5F7FA;
    }
    .user{
        width: 60px;
        text-align: center;
    }
    .user:hover{
        background-color: #F5F7FA;
    }
    .i-user >>> .ivu-select-dropdown{
        /*margin-left: 87px;*/
        text-align: center;
    }
    .login-user{
    }
</style>
