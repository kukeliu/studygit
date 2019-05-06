import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const route = [
  {
    path:'/login',
    name:'adminLogin',
    component: () => import('@/views/login'),
  },
  {
    path:'/',
    name:'adminLogin',
    component: () => import('@/views/adminLogin'),
  },
  {
    path:'/wrapper',
    name:'wrapper',
    component:()=>import('@/components/wrapper1'),
    children:[
      {
        path: '/apiList',
        name: 'apiList',
        component: () => import('@/views/manage/apiList'),
        children:[
          {
            path: '/addApi',
            name: 'addApi',
            meta: {
              title: '新建接口'
            },
            component:()=>import('@/views/manage/addApi'),
          },
          {
            path: '/batchInterface',
            name: 'batchInterface',
            meta: {
              title: '新建批量接口'
            },
            component:()=>import('@/views/manage/batchInterface'),
          },
          {
            path: '/addApplication',
            name: 'addApplication',
            meta: {
              title: '新建应用'
            },
            component:()=>import('@/views/manage/addApplication'),
          },
          {
            path: '/apiDetail',
            name: 'apiDetail',
            meta: {
              title: '接口详情'
            },
            component:()=>import('@/views/manage/apiDetil'),
          },
          {
            path: '/apiType',
            name: 'apiType',
            meta: {
              title: '接口分类 '
            },
            component:()=>import('@/views/manage/apiType'),
          },
          {
            path: '/testapi',
            name: 'testapi',
            meta: {
              title: '测试接口 '
            },
            component:()=>import('@/views/manage/testapi'),
          },
          {
            path: '/apiLists',
            name: 'apiLists',
            meta: {
              title: '接口列表'
            },
            component:()=>import('@/views/manage/apiLists'),
          },

        ]
      },
      {
        path: '/manageUser',
        name: 'manageUser',
        component: () => import('@/views/manage/manageUser'),
      },
      {
        path: '/applicationWhole',
        name: 'applicationWhole',
        component: () => import('@/views/manage/application/applicationWhole'),
        redirect:'/application',
        children:[
          {
            path:'/application',
            name:'application',
            component: () => import('@/views/manage/application/application'),
          },
          {
            path:'/dataanlay',
            name:'dataanlay',
            component: () => import('@/views/manage/application/dataanlay'),
          },
          {
            path:'/dataDetail',
            name:'dataDetail',
            component: () => import('@/views/manage/application/dataDetail'),
          },
          {
            path:'/detailovew',
            name:'detailovew',
            component: () => import('@/views/manage/application/detailovew'),
          },
        ]
      },
      {
        path: '/addWhole',
        name: 'addWhole',
        component: () => import('@/views/manage/addWhole'),
        redirect:'/datasourceConfig',
        children:[
          {
            path: '/datasourceConfig',
            name: 'datasourceConfig',
            component: () => import('@/views/manage/datasourceConfig'),
          },
          {
            path: '/addConfig',
            name: 'addConfig',
            component: () => import('@/views/manage/addConfig'),
          },
        ]
      },

      {
        path: '/userConfig',
        name: 'userConfig',
        component: () => import('@/views/manage/userConfig'),
      },
    ]
  },


    {
        path: '/index',
        name: 'index',
        component: () => import('@/views/client/index'),
        children:[
            {
                path: '/apiDoc',
                name: 'apiDoc',
                meta: {
                    title: '接口文档'
                },
                component:()=>import('@/views/client/apiDoc'),
            },
            {
                path: '/apiListsclient',
                name: 'apiListsclient',
                meta: {
                    title: '接口文档'
                },
                component:()=>import('@/views/client/apiListsClient'),


            },
          {
            path: '/Detail',
            name: 'Detail',
            meta: {
              title: '接口详情'
            },
            component:()=>import('@/views/manage/apiDetil'),
          },
          {
            path: '/test',
            name: 'test',
            meta: {
              title: '测试接口 '
            },
            component:()=>import('@/views/manage/testapi'),
          },

        ]
    },
  {
    path:'/401',
    name:'401',
    meta:{
      title:'401'
    },
    component:()=>import('@/views/common/401'),
  }

]
export default new Router({
  // mode:'history',
  base: 'apiManage',
  routes: [...route]
})
