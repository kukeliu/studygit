import axios from 'axios';
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import qs from 'qs';

axios.defaults.baseURL = process.env.BASE_URL

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = false//让请求携带cookie
axios.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
// console.log(token)
      config.headers.Authorization = "Bearer" + " " +`${token}`;
// console.log(config)
    return config;
  },
  err => {
    return Promise.reject(err);
  });

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
// console.log(err)
  if (err && err.response) {

    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break;
      case 401:
        err.message = '未授权，请重新登录'
        break;
      // case 403:
      //   err.message = '拒绝访问'
      //   break;
      case 404:
        err.message = '请求错误,未找到该资源'
        break;
      case 405:
        err.message = '请求方法未允许'
        break;
      case 408:
        err.message = '请求超时'
        break;
      case 500:
        err.message = '服务器端出错'
        break;
      case 501:
        err.message = '网络未实现'
        break;
      case 502:
        err.message = '网络错误'
        break;
      case 503:
        err.message = '服务不可用'
        break;
      case 504:
        err.message = '网络超时'
        break;
      case 505:
        err.message = 'http版本不支持该请求'
        break;
      default:
        err.message = `连接错误${err.response.status}`
    }
  }
  else {
    err.message = "连接到服务器失败"
  }
  iView.Message.error(err.message)
  return Promise.resolve(err.response)
})

export default {
  //post 返回blod数据
  dpost(url, param,data='1') {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data:param,
        headers:{
          // 'Content-Disposition':'attachment;',
          'Content-Type':'application/json;charset=utf-8',
          // 'Authorization':"Bearer" + " " + sessionStorage.getItem("token")
        },
        responseType: 'blob'
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //post请求 json提交
  post(url, param,data='1') {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data:param,
        headers:{
          // 'Authorization':"Bearer" + " " + sessionStorage.getItem("token")
        }
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //表单提交
  postForm(url, param,data='1') {
    param =  qs.stringify(param)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data:param,
        headers:{
          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
          // 'Authorization':"Bearer" + " " + sessionStorage.getItem("token")
        }
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params:param,
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
