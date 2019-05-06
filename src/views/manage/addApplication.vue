<template>
<div>
  <div class="tt">
    <span class="fs-18">新增应用</span>
    <div class="mgt-20" >
      <span class="w-40">名称：</span>
      <Input  placeholder="应用名称" style="width: 90%;" v-model="appName"/>
    </div>

    <div class="mgt-20">
      <span class="w-40">所属部门：</span>
      <Input  placeholder="应用所属部门" style="width: 90%;" v-model="department"/>

      <!--<Select v-model="department" style="width:365px;margin-left: -3px;">-->
        <!--<Option v-for="item in apiList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
      <!--</Select>-->
    </div>
    <div class="mgt-20"><span class="w-40">管理人：</span>
      <Input  placeholder="管理人工号" style="width: 90%;" v-model="manager"/>

      <!--<Select v-model="manager" style="width:365px;margin-left: -3px;">-->
        <!--<Option v-for="item in userList" :value="item.zgh" :key="item.zgh">{{ item.name }}-{{item.zgh}}</Option>-->
      <!--</Select>-->
    </div>
    <div class="mgt-20" >
      <span class="w-40">描述：</span>
      <Input  type="textarea" :rows="4" placeholder="应用描述" style="width: 90%;" v-model="appdesc"/>
    </div>
    <Button type="primary" size="large" style="margin-top: 60px;background-color: #202D40;border-color: #202D40;" @click="addApplication">新建应用</Button>
  </div>
</div>
</template>

<script>

    export default {
        data(){
          return{
            apiList:[],
            appName:'',
            department:'',
            manager:'',
            appdesc:'',
            userList:[]
          }
        },
      inject:['getApiNum'],
      mounted(){
        this.getAllUserInfo()
      },
      methods:{
          getAllUserInfo(){
            this.axios.postForm('user/getAllUser',{})
              .then((res)=>{
                this.userList=res.content
              })
          },
        addApplication(){
            let obj={
              "appName": this.appName,
              "appDesc": this.appdesc,
              "appDepartment":this.department,
              "manageUserId": this.manager,
              "imgUrl": 'api_'+this.getImgUrl()
            }

            this.axios.post('applicationManagement/createApplication',obj)
              .then((res)=>{
                this.$Message.info(res.msg);
                if(res.code=='10000'){
                  // this.$Message.success(res.msg);
                  this.getApiNum()
                }

              })
        },
        getImgUrl(){
          let random = Math.floor(Math.random()*25+1);
          return random;
        },
      }
    }
</script>

<style scoped>
  .w-40{
    width: 60px;
    display: inline-block;
    text-align: right;
  }
  .mgt-20{
    margin-top: 20px;
  }
</style>
