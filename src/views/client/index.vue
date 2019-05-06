<template>
    <div>
        <wrapper>
            <div class="content">
                <div class="left">
                    <div class="lefttop">
                        <span class="fs-18" style="color: #202D40">接口</span>
                    </div>
                    <div class="my-all" :class="{onf:iisFocusAll}" @click="choseItem(0)"><Icon type="ios-archive" :size="20"/>所有接口 (<span>{{apiNum.all}}</span>)</div>
                    <div class="my-all" :class="{onf:iisFocusCreate}" @click="choseItem(1)"><Icon type="md-create" :size="20"/>已申请的 (<span>{{apiNum.success}}</span>)</div>
                    <div class="my-all" :class="{onf:iisFocusJoin}" @click="choseItem(2)"><Icon type="ios-umbrella" :size="20"/>待批准的 (<span>{{apiNum.wait}}</span>)</div>
                  <div class="my-all" :class="{onf:iisFocusno}" @click="choseItem(3)"><Icon type="ios-close-circle" :size="20"/>未批准的 (<span>{{apiNum.fail}}</span>)</div>

                </div>
                <div class="right">
                    <router-view v-if="isRouterAlive"/>
                </div>
            </div>
        </wrapper>
    </div>
</template>

<script>

    import Wrapper from '@/components/wrapper.vue'
    export default{
        components: {
            Wrapper
        },
        data() {
            return {
                isRouterAlive: true,
                apiNum:{
                  all:0,
                  fail:0,
                  wait:0,
                  success:0
                },
                iisFocusAll:false,
                iisFocusCreate:false,
                iisFocusJoin:false,
              iisFocusno:false,
                rightTitle:"所有接口",
                currentNum:'0',

            }
        },
      provide(){
        return{
          reload1:this.reload,
          getApiNum:this.getApiNum,
        }
      },
        created() {},
        mounted() {
            this.getApiNum();
        },
        methods: {
            //获取各分类的接口个数
            async getApiNum(){
                await this.axios.postForm("apiUserManagement/getClassifyApiNum",{}).then(res=>{
                    if(res.code== "10000"){
                        this.apiNum = res.content;
                        this.$nextTick(()=>{
                            let selected = sessionStorage.getItem("selected");
                            if(selected === "iisFocusAll"){
                                this.iisFocusAll = true;
                            }else if(selected === "iisFocusCreate" ){
                                this.iisFocusCreate = true;
                            }else if(selected === "iisFocusJoin"){
                                this.iisFocusJoin = true;
                            }else if(selected === "iisFocusno"){
                              this.iisFocusno = true;
                            }
                            else{
                                this.iisFocusAll = true;
                            }
                            this.currentNum = this.apiNum.all;
                            this.$router.push({
                                path:'/apiListsclient',
                                query:{
                                    rightTitle:this.rightTitle,
                                    currentNum:this.currentNum,
                                }
                            })
                        })
                    }
                }
            )},
            reload () {
                this.isRouterAlive = false
                this.$nextTick(() => (this.isRouterAlive = true))
            },
            choseItem(p){
                if(p===0){
                    this.iisFocusAll = true;
                    this.iisFocusCreate = false;
                    this.iisFocusJoin = false;
                  this.iisFocusno = false;
                    this.rightTitle = "所有接口";
                    this.currentNum = this.apiNum.all;
                    sessionStorage.setItem("selected","iisFocusAll")
                }else if(p === 1){
                    this.iisFocusAll = false;
                    this.iisFocusCreate = true;
                    this.iisFocusJoin = false;
                  this.iisFocusno = false;
                    this.rightTitle = "已申请的";
                    this.currentNum = this.apiNum.success;
                    sessionStorage.setItem("selected","iisFocusCreate")
                }else if(p === 2){
                    this.iisFocusAll = false;
                    this.iisFocusCreate = false;
                  this.iisFocusno = false;
                    this.iisFocusJoin = true;
                    this.rightTitle = "待批准的";
                    this.currentNum = this.apiNum.wait;
                    sessionStorage.setItem("selected","iisFocusJoin")
                }else if(p === 3){
                  this.iisFocusAll = false;
                  this.iisFocusCreate = false;
                  this.iisFocusJoin = false;
                  this.iisFocusno = true;
                  this.rightTitle = "未批准的";
                  this.currentNum = this.apiNum.fail;
                  sessionStorage.setItem("selected","iisFocusJoin")
                }
                this.$router.push({
                    path:'apiListsclient',
                    query:{
                        rightTitle:this.rightTitle,
                        currentNum:this.currentNum,
                    }
                })
                this.reload()
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
        padding: 30px 34px 20px;
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
