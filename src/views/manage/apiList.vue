<template>
  <div>
    <!--<wrapper >-->
        <div class="content">
          <div class="left">
            <div class="lefttop">
              <span class="fs-18" style="color: #202D40">应用</span>
              <span @click="addNewApi">
                <Tooltip placement="top" content="新建应用" style="float: right;margin-top: 4px" >
                  <Icon type="md-add" class="fs-18  fw-8" style="color: #202D40;"/>
                </Tooltip>
              </span>
            </div>
            <!--<div class="my-all" :class="{onf:isFocusAll}" @click="choseItem(0)"><Icon type="ios-archive" :size="20"/>所有应用 (<span>{{apiNum.all}}</span>)</div>-->
            <div class="my-all" :class="{onf:isFocusCreate}" @click="choseItem(1)"><Icon type="md-create" :size="20"/>我管理的 (<span>{{apiNum.manage}}</span>)</div>
            <div class="my-all" :class="{onf:isFocusJoin}" @click="choseItem(2)"><Icon type="ios-umbrella" :size="20"/>未参与的 (<span>{{apiNum.other}}</span>)</div>
          </div>
          <div class="right">
                <router-view v-if="isRouterAlive"/>
          </div>
        </div>
    <!--</wrapper>-->
  </div>
</template>

<script>
  import Wrapper from '@/components/wrapper1.vue'

  export default{
        components: {
          Wrapper
        },
        provide(){
          return{
            reload1:this.reload1,
            getApiNum:this.getApiNum,
          }
        },
      data() {
      return {
          isRouterAlive: true,
        apiNum:{
          all:0,
          manage:0,
          other:0
        },
        isFocusAll:false,
        isFocusCreate:false,
        isFocusJoin:false,
        rightTitle:"我管理的",
        currentNum:'0',
      }
    },
    created() {
    },
    mounted() {
      sessionStorage.setItem("selected","isFocusCreate")
      this.getApiNum();
    },
    methods: {
        //获取各分类的接口个数
        async getApiNum(){
          await this.axios.postForm('applicationManagement/getSumApplication',{}
            ).then(res=>{
            if(res.code== "10000"){
              this.apiNum = res.content;
              this.$nextTick(()=>{
                let selected = sessionStorage.getItem("selected");
                if(selected === "isFocusAll"){
                  this.isFocusAll = true;
                }else if(selected === "isFocusCreate" ){
                  this.isFocusCreate = true;

                  this.currentNum = this.apiNum.manage;
                  this.rightTitle='我管理的'
                  // console.log( this.currentNum)
                }else if(selected === "isFocusJoin"){
                  this.isFocusJoin = true;
                  this.currentNum = this.apiNum.other;
                  this.rightTitle='未参与的'
                }else{
                  this.isFocusAll = true;
                }


                this.$router.push({
                  path:'/apiLists',
                  query:{
                    rightTitle:this.rightTitle,
                    currentNum:this.currentNum,
                  }
                })
              })
            }
          })
        },
        onload(){
            this.$router.push({
                path:'/apiLists',
                query:{
                    rightTitle:this.rightTitle,
                    currentNum:this.currentNum,
                }
            })
        },
          reload1 () {
              this.isRouterAlive = false
              this.$nextTick(() => (this.isRouterAlive = true))
           }
        ,
        choseItem(p){
            if(p === 0){
              this.isFocusAll = true;
              this.isFocusCreate = false;
              this.isFocusJoin = false;
              this.rightTitle = "所有应用";
              this.currentNum = this.apiNum.all;
              sessionStorage.setItem("selected","isFocusAll")
            }else if(p === 1){
              this.isFocusAll = false;
              this.isFocusCreate = true;
              this.isFocusJoin = false;
              this.rightTitle = "我管理的";
              this.currentNum = this.apiNum.manage;
              sessionStorage.setItem("selected","isFocusCreate")
            }else if(p === 2){
              this.isFocusAll = false;
              this.isFocusCreate = false;
              this.isFocusJoin = true;
              this.rightTitle = "未参与的";
              this.currentNum = this.apiNum.other;
              sessionStorage.setItem("selected","isFocusJoin")
            }
            this.$router.push({
                path:'/apiLists',
                query:{
                    rightTitle:this.rightTitle,
                    currentNum:this.currentNum,
                }
            })
            this.reload1()
        },
        addNewApi(){
            this.$router.push('/addApplication')
        },
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
