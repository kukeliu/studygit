<template>
  <div>
    <!--<wrapper>-->
      <div class="_content1">
        <div class="second">
          <ul>

            <li v-for='(item,index) in list' :key='item.id' :name='item.name'
                :class="{ 'headListActive': current==index }"
                @click='chooseTitle(item,index)'
            >
              <router-link :to="item.resComponent">
                {{item.name}}
              </router-link>

            </li>
          </ul>
        </div>

      </div>

      <router-view />
    <!--</wrapper>-->

  </div>
</template>
<script>
  import Wrapper from "../../../components/wrapper1";

  export default {
    components: {Wrapper},
    data(){
      return{
        list:[
          {
            id:'0',name:'数据概览',resComponent:'/application'
          },
          {
            id:'1',name:'数据分析',resComponent:'/dataanlay'
          },
          {
            id:'2',name:'数据明细',resComponent:'/dataDetail'
          }
        ],
        current:0
      }
    },
    mounted(){
      // this.current=0
      this.$router.push({path:'/application'})
    },
    provide(){
      return{
        chooseTitle:this.chooseTitle
      }
    },
    methods:{
      chooseTitle(item,index){

          this.current=index
          // this.$router.push({path:item.resComponent})
      }
    }

  }
</script>
<style scoped>

  .second .ivu-menu-dark {
    background: none;
  }
  .second a {
    color: #000 ;
  }
  .second .headListActive a{
    color: #9f1c33 !important;
  }
  .second ul li{
    list-style: none;
    float: left;
    padding: 0 20px;
    font-size: 15px;
    cursor: pointer;
  }
  ._content1{
    display: flex;
    /*padding: 20px 0;*/
    height: 100%;
    max-width: 1200px;
    margin: auto;
  }
  .second{
    height:40px!important;
    width: 100%;
  }
</style>
<style>

</style>
