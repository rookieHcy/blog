---
title: 气泡确认框
date: 2020-03-18 11:19:09
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---

气泡确认框和对话框实现类似，一般应用在需要二次确认的关键按钮上。要触发确认框的html元素需要绑定reference插槽
见[Popconfirm 气泡确认框](https://element.eleme.cn/#/zh-CN/component/popconfirm)

| 参数     | 说明   |
| -------- | ------ |
| title    | 确认框文案 |
| icon-color    | 图标颜色 |
| @onConfirm  | 回调函数 |

## 例子
```vue
<el-popconfirm
    title="确认删除吗？"
    icon-color="red"
    @onConfirm="() => handlerDelete(row)"
    >
    <el-button slot="reference" size="mini" type="danger">
      删除
    </el-button>
</el-popconfirm>
```
![](https://s2.ax1x.com/2020/02/14/1X8Y4g.png)
