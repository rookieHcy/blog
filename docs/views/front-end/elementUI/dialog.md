---
title: 对话框
date: 2020-03-18 11:10:44
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---
弹框使用elementUI对话框开发，参考文档[对话框](https://element.eleme.cn/#/zh-CN/component/dialog)


## destroy-on-close	
这是一个很关键的属性，在对话框关闭的时候销毁对话框，避免下次弹出窗口时展示遗留上一次的使用痕迹

## 例子
```vue
<el-dialog title="批量发布结果" :visible.sync="dialogFormVisible" width="90%" destroy-on-close>
</el-dialog>
```

