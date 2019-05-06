// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Vuebar from 'vuebar';
import axios from './api/axios'
import lodash from 'lodash';

Vue.use(Vuebar);
Vue.use(iView);
Vue.config.productionTip = false
Vue.prototype.axios = axios
Window.prototype.axios = axios
Vue.prototype.BASE_URL = process.env.BASE_URL
Window.prototype.BASE_URL = process.env.BASE_URL
Window.prototype.LOGOUT_URL = process.env.LOGOUT_URL

// var echarts = require('echarts');

// 路由加载进度条
iView.LoadingBar.config({
  color: '#285f90',
  failedColor: '#285f90',
  height: 3
});
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
