---
title: 日期时间选择器
date: 2020-03-18 11:29:45
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---

在同一个选择器里选择日期和时间
<br>
见[DateTimePicker 日期时间选择器](https://element.eleme.cn/#/zh-CN/component/datetime-picker)
```vue
<el-date-picker
    v-model="listQuery.date"
    type="datetimerange"
    :picker-options="pickerOptions"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    align="right"
    style="width: 100%;"
/>
```


## 快捷选择
```js
pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        // disabledDate: (time) => {
        //   const before = new Date()
        //   before.setFullYear(before.getFullYear() - 1)
        //   // return time.getTime() < before.getTime() || time.getTime > Date.now
        //   return time.getTime() < before || time.getTime() > new Date()
        // }
}
```
