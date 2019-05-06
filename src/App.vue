<template>
    <div id="app" :style="{height:height,background:'#f5f7f9'}">

        <transition name="fade-transform" mode="out-in">
            <router-view />
        </transition>

    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            height: window.innerHeight + 'px',
            isRouterAlive:true
        }
    },
    method:{
    }
}
</script>

<style>
  @import './less/color.less';
  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    padding: 0px 0px 10px;
    color: #202d40;

  }
  h1 {
    color:#040404;
    /*color: #fff;*/
    font-size: 20px!important;
    letter-spacing: 0.1em;
    display: inline;
    vertical-align: middle;
    margin-left: 6px;
    font-weight: 400;
    /*font-size: 16px;*/
    /*letter-spacing: .1em;*/
    /*display: inline;*/
    /*vertical-align: middle;*/
    /*margin-left: 6px;*/
  }
  .tc {
    text-align: center;
  }
  .tl {
    text-align: left;
  }
  .tr {
    text-align: right;
  }
  .fs-18{
    font-size: 18px;
  }
  .va-m{
    vertical-align: middle;
  }
  .fw-8{
    font-weight: 800;
  }
  .dp-ib{
    display: inline-block;
  }
  .mt-20{
    margin-top: 20px;
  }
  ::-webkit-scrollbar {/*滚动条整体样式*/
      width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
  }
  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(218,223,230,0.2);
      background: #DADFE6;
  }
  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(218,223,230,0.2);
      border-radius: 10px;
      background: #EDEDED;
  }
</style>
