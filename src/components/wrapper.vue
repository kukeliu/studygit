<template>
    <Layout>
        <Header :style="{zIndex:10,lineHeight:`${toTop}px`,height:`${toTop}px`,position: 'fixed', width: '100%',background:'#fff','box-shadow': '-12px -9px 20px 0px #848484',padding:0,minWidth:'1300px'}">
            <Row>
                <Col class="tl" span="8" offset="1">
                    <img style="vertical-align: middle;width: 35px;" src="@/assets/logologo.png" alt="接口管理平台">
                    <h1 style="display: inline-block;">接口管理平台</h1>
                </Col>
                <Col span="8" offset="7" class="i-user">
                    <Dropdown style="position: absolute;left:300px;">
                        <a class="login-user" href="javascript:void(0)">
                            <div style="display:inline-block;margin-left: 80px;" class="user">
                                <img style="vertical-align: middle;" src="@/assets/user.png" alt="用户" />
                            </div>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem >{{userName}}</DropdownItem>
                            <DropdownItem divided to="/" @click.native="pushManage" v-show="name=='role_xt'">管理端</DropdownItem>
                            <!--<DropdownItem to="/" @click.native="layout">退出</DropdownItem>-->
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
        </Header>
        <Content :style="{margin: `${toTop}px 0 0`, background: '#F6F7FB', minHeight: `${minHeight-toTop}px`,minWidth:'1080px'}">
            <Row>
                <Col span="22" offset="1" style="padding:16px 0">
                    <slot></slot>
                </Col>
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
              userName:''
            }
        },
        mounted() {

          this.name=sessionStorage.getItem('infomation')
          // console.log(this.name)
         this.userName=sessionStorage.getItem('xingming')
          // console.log( this.name)
          // console.log(a)
            window.onresize = () => {
                this.minHeight = window.innerHeight
            }
        },
        methods: {
            pushManage(){
                this.$router.push('/apiList')
            },
            manageUser(){
                window.open("http://localhost:8084/#/manageUser","_self")
            },
             layout(){
                this.axios.postForm('user/logout',{})
                  .then((res)=>{
                    if(res.code=='10000'){
                      sessionStorage.removeItem('token');
                      sessionStorage.clear();
                      getToken(res.content)
                      this.$router.push({path:'/'})
                    }
                  })
            }
        },
    }
</script>

<style scoped>
    .mgl-240{
        /*margin-left: 240px;*/
    }
    .mgl-240:hover{
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
        margin-left: 87px;
        text-align: center;
    }
</style>
