---
title: axios的使用
date: 2020-03-18 11:45:11
tags:
 - Vue
 
categories:
 -  前端
---

## request.js
通过封装[axios](https://github.com/axios/axios)，统一请求、响应、异常，和服务端进行交互
<br>

:::tip 
详见[和服务端进行交互](../frontTemplate/essentials/server.html)
:::

请求超时时间：30000ms
```js
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})
```

每次请求先校验是否含有token，没有禁止访问
```js
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
```

:::tip 
以上代码位于`src/utils/request.js`
:::

## 编辑请求

具体的请求需要引用`request.js`

```js
export function 方法名(参数) {
  return request({
    url: '请求地址',
    method: '请求方法：get/post'
    params: { id } 或 datas: id
  })
}
```

:::tip 说明
方法名：在组件中引用<br>
url: 请求后端的地址<br>
method: 请求方法，get或post方法<br>
参数分为两种: <br>
    prams: { id }  实际为: id=实参id<br>
    datas: id   实际为json形式: { id }
:::

例子1：
```js
export function physicalDeleteProd(id) {
  return request({
    url: '/prod/physicalDelete',
    method: 'post',
    params: { id }
  })
}
```

例子2：
```js
export function next(form) {
  return request({
    url: '/prod/next',
    method: 'post',
    data: form
  })
}
```

## 组件引用
通过import导入
```js
import { method } from '@/api/xxx'
```

例子：
```js
import { publishInterface, copyInterface } from '@/api/platform/interface'
```

:::tip
`@`为设置的相对路径，相当于`src`
:::

绑定方法调用，接收响应，例如：
```js
handlerPublished(row) {
      publishInterface(row.id).then(response => {
        row.status = 2
        row.statusName = '已发布'
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.handleFilter()
      })
    }
}
```
