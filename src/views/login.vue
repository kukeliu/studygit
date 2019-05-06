<template>
  <div>
  </div>
</template>

<script>
  import {getToken} from '../constant/token'
  import {getZgh} from '../constant/token'
  import {getInfo} from '../constant/token'
  import {getInfo1} from '../constant/token'
  import {getUserName} from '../constant/token'
  export default {
    components: {},
    data() {
      return {
        height: `${window.innerHeight}px`,
        userName:{},
      }
    },
    created() {},
    mounted() {
      const param = this.$route.query
      if (param.username) {
        this.isAuthenticated(param)
      }else{

        this.$router.push({path:'/401'})
      }
    },
    methods: {
      isAuthenticated(param){
        // console.log(param)

        this.axios.get('user/isAuthenticated',param).then((res)=>{
            // console.log(res)
          getUserName(res.content.userRole.contactName)
          if(res.code=='10000'){
            // console.log(res)
            getToken(res.content.token)
            getZgh(res.content.userRole.employeeNumber)
            // console.log(param)
            if(res.content.userRole.roleList.length>=2){
              let obj=res.content.userRole.roleList.filter(item=>item.roleCode=='role_xt')
              let object=res.content.userRole.roleList.filter(item=>item.roleCode=='role_pt')
              // console.log(object)
              getInfo('role_pt')

              if(obj.length!=0){
                getInfo1(obj[0].roleCode)
              }

              if(param.type==0&&obj.length!=0){
                this.$router.push({path:'/apiList'})
              }else if(param.type==1){
                this.$router.push({path:'/index'})
              }else{
                this.$router.push({path: '/401'})
              }
            }else if(res.content.userRole.roleList.length==1){
              let arr=res.content.userRole.roleList.filter(item=>item.roleCode=='role_xt')
              if(arr.length!=0){
                getInfo('role_pt')
                getInfo1(arr[0].roleCode)
                if(param.type==0){

                      this.$router.push({path:'/apiList'})

                    }else{
                  this.$router.push({path: '/index'})
                }
              }else{
                if(param.type==0){
                  this.$router.push({path:'/401'})
                }else{
                  this.$router.push({path: '/index'})
                }
              }
              // if(res.content.userRole.roleList[0].roleCode=='role_xt'){
              //   if(param.type==0){
              //     this.$router.push({path:'/apiList'})
              //   }
              //   else if(param.type==1) {
              //     this.$router.push({path: '/index'})
              //   }
              // }
              // else if(res.content.userRole.roleList[0].roleCode=='role_pt'){
              //   if(param.type==0){
              //     this.$router.push({path:'/401'})
              //   }
              //   else if(param.type==1) {
              //     this.$router.push({path: '/index'})
              //   }
              // }
            }else if(res.content.userRole.roleList.length==0){
              if(param.type==0){
                this.$router.push({path:'/401'})
              }
              if(param.type==1) {
                this.$router.push({path: '/index'})
              }
            }
          }else{
            this.$Message.error(res.msg)
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>

