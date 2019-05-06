<template>
    <div>
        <div>
            <div class="rightTitle">
                <div>{{rightTitle}}({{currentNum}})</div>
            </div>
            <Input v-model="interfaceParam" placeholder="筛选应用" style="width: auto" class="search" @on-enter="search">
                <Icon type="ios-search" slot="suffix" @click.native="search"/>
            </Input>
            <br>
            <div v-for="(item,index) in apiLists" style="display: inline-block;margin-right: 60px;" :key="index">
                <div style="padding: 20px;" class="card-api"   @mouseenter="enter(index)" @mouseleave="leave()">
                    <div class="hv">
                      <div style="display: inline-block" @click="apiDetail(item.applicationId)">
                        <div class="icon-1 dp-ib"><img :src="imgUrl(item.imgUrl)" class="icon-1"/></div>
                        <div class="dp-ib tt-desc">
                          <div class="tt">{{item.appName}}</div>
                          <div class="desc">{{item.appDesc}}</div>
                        </div>
                      </div>

                      <div style="display:inline-block;float: right;margin-top: 20px" v-if="index==current" v-show="rightTitle=='我管理的'">
                        <span class="addStyle" style="background-color:  rgba(128, 128, 128, 0.19);margin-right: 5px" @click="updateAppli(item)">
                          <img src="../../assets/updateApp.png" alt="" style="width: 20px">
                        </span>
                        <span class="addStyle" style="background-color: rgba(255, 0, 0, 0.2)" @click="deleteAppli(item)">
                          <img src="../../assets/deleteApp.png" alt="" style="width: 20px">
                        </span>
                      </div>
                      <div style="display:inline-block;float: right;margin-top: 20px" v-if="index==current" v-show="rightTitle=='未参与的'">
                        <span class="addStyle" style="background-color:  rgba(128, 128, 128, 0.19);margin-right: 5px" @click="seeDeatil(item)">
                          <img src="../../assets/seedetail.png" alt="" style="width: 20px">
                        </span>

                      </div>
                    </div>
                </div>

            </div>
          <div style="padding: 20px;"  >
            <div class="hv">
              <!--<img src="../../assets/add.png" alt="" width="50px">-->
            </div>
          </div>
        </div>
      <Modal
        v-model="seedetail"
        title="查看详情"

      >
        <div class="mgt-20" >
          <span class="w-40">名称：</span>
          {{appName}}
        </div>

        <div class="mgt-20">
          <span class="w-40">所属部门：</span>
          {{department}}
        </div>
        <div class="mgt-20"><span class="w-40">管理人：</span>
         {{manager}}
        </div>
        <div class="mgt-20" >
          <span class="w-40">描述：</span>
        {{appdesc}}
        </div>
      </Modal>
      <Modal
      v-model="isShowModel"
      title="修改应用"
      @on-ok="updateOK"
      >
        <div class="mgt-20" >
          <span class="w-40">名称：</span>
          <Input  placeholder="应用名称" style="width:365px;" v-model="appName"/>
        </div>

        <div class="mgt-20">
          <span class="w-40">所属部门：</span>
          <Input  placeholder="应用所属部门" style="width:365px;" v-model="department"/>

          <!--<Select v-model="department" style="width:365px;margin-left: -3px;">-->
            <!--<Option v-for="item in apiList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
          <!--</Select>-->
        </div>
        <div class="mgt-20"><span class="w-40">管理人：</span>
          <Input  placeholder="管理人" style="width:365px;" v-model="manager"/>

          <!--<Select v-model="manager" style="width:365px;margin-left: -3px;">-->
            <!--<Option v-for="item in userList" :value="item.zgh" :key="item.zgh">{{ item.name }}</Option>-->
          <!--</Select>-->
        </div>
        <div class="mgt-20" >
          <span class="w-40">描述：</span>
          <Input  type="textarea" :rows="4" placeholder="应用描述" style="width:365px;" v-model="appdesc"/>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default{
        components: {
        },
        data() {
            return {
              seedetail:false,
                interfaceParam:'',
                rightTitle:'',
                currentNum:'',
                apiLists:[],
                copyArr:[],
              current:-1,
              isShowModel:false,

              apiList:[],
              appName:'',
              department:'',
              manager:'',
              appdesc:'',
              userList:[],
              applicationId:''
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
            getApi(){
              this.axios.postForm("applicationManagement/getApplicationInfo",{
                "titleMessage":this.rightTitle
              }).then(res=>{
                if(res.code=="10000"){
                  this.apiLists = res.content;

                  this.copyArr=JSON.parse(JSON.stringify(this.apiLists))
                }
              })
            },
            getParams(){
                this.rightTitle = this.$route.query.rightTitle;
                this.currentNum = this.$route.query.currentNum;
            },
            imgUrl:function (param) {
                return require('../../assets/image/'+param+'.png')
            },
            apiDetail(id){
              if(this.rightTitle=='我管理的'){
                this.$router.push({path:'/apiType',query:{applicationId:id}})

              }


            },
            search(){
              let tempArray=[]
              for(let i=0;i< this.copyArr.length;i++){
                if( this.copyArr[i].appName.indexOf(this.interfaceParam)>=0){
                  tempArray.push(this.copyArr[i])

                }
                this.apiLists=tempArray
              }
            },
          enter(index){
            // this.seen = true;
            this.current = index;
          },
          leave(){
            // this.seen = false;
            this.current = null;
          },
          deleteAppli(item){

            this.$Modal.confirm({
              title: '是否确认删除',
              content :'如果删除'+item.appName+'应用，该应用下的接口也会删除',
              onOk: () => {
                this.axios.postForm('applicationManagement/deleteApplication',{applicationId:item.applicationId})
                  .then((res)=>{
                    if(res.code=="10000"){
                      this.getApi();
                      this.$Message.info(res.content);
                      this.getApiNum()
                      this.currentNum = this.$route.query.currentNum-1;
                    }
                  })
              },
            });
          },
          updateAppli(item){
              this.isShowModel=true;
              this.getAllUserInfo()
            this.department=item.appDepartment
              this.appName=item.appName;
            this.manager=item.manageUserId;
              this.appdesc=item.appDesc,
                this.applicationId=item.applicationId
          },
          seeDeatil(item){

              this.seedetail=true
            this.appName=item.appName;
              this.department=item.appDepartment
            this.manager=item.manageUserId;
            this.appdesc=item.appDesc
              // this.applicationId=item.applicationId
          },
          updateOK(){
            let obj={
              "applicationId": this.applicationId,
              "appName": this.appName,
              "appDesc": this.appdesc,
              "appDepartment":this.department,
              "manageUserId":this.manager
            }
              this.axios.post('applicationManagement/updateApplication',obj)
                .then((res)=>{
                  if(res.code='10000'){
                    this.$Message.info(res.msg);
                    this.getApi();
                    this.getApiNum()
                  }


                })
          },
          getAllUserInfo(){
            this.axios.postForm('user/getAllUser',{})
              .then((res)=>{
                this.userList=res.content
              })
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
        width: 120px;
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
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .dsnone{
        display: none;
    }
  .addStyle{
    width: 32px;
    height: 32px;
    display: inline-block;
    border-radius: 50%;

    padding: 6px;
  }
    .w-40{
      width: 80px;
      display: inline-block;
      text-align: right;
    }
    .mgt-20{
      margin-top: 20px;
    }
</style>

