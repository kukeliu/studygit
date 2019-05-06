<template>
  <div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        height: `${window.innerHeight}px`,
        loginForm: {
          account: '',
          passwd: ''
        },
        userName:"",
        password:""
      }
    },
    created() {},
    mounted() {
      this._loginSubmit();
    },
    methods: {
      _loginSubmit() {
          this.axios
            .postForm("/login", {
              username: "admin"
            })
            .then(res => {
              if(res.success){
                this.$router.push('/index')
              }else{
                this.$Message.error(res.msg);
              }
            })
            .catch(err => {

            });
        }

    }
  }
</script>
<style scoped>
</style>

<style scoped lang="less">

</style>
