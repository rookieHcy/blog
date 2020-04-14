---
title: 表单
date: 2020-03-18 11:22:57
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---


由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据
见[Form 表单](https://element.eleme.cn/#/zh-CN/component/form)


## 表单校验
在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

### 普通校验
`Form` 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并将 `Form-Item` 的 `prop` 属性设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

Form:
```vue
<el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="90px" style="width: 490px;">
  <el-form-item label="产品编码" prop="number">
    <el-input v-model="postForm.number" />
  </el-form-item>
  <el-form-item label="产品名称" prop="name">
    <el-input v-model="postForm.name" />
  </el-form-item>
  <el-form-item label="产品组" prop="groupId">
    <el-select v-model="postForm.groupId" class="filter-item" style="width: 400px">
      <el-option v-for="item in prodGroupOptions" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </el-form-item>
  <el-form-item label="版本号" prop="version">
    <el-input v-model="postForm.version" />
  </el-form-item>
  <el-form-item label="说明">
    <el-input v-model="postForm.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入产品说明..." />
  </el-form-item>
</el-form>
```

`rules`需要编码在`data`下：
```js
data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      tempRoute: {},
      prodGroupOptions,
      id: undefined,
      rules: {
        number: [{ required: true, message: '产品编码不允许为空', trigger: 'blur' }],
        name: [{ required: true, message: '产品名称不允许为空', trigger: 'blur' }],
        groupId: [{ required: true, message: '产品组为必选', trigger: 'change' }],
        version: [{ required: true, message: '版本号不允许为空', trigger: 'blur' }]
      }
    }
}
```

### 自定义校验

当普通校验不满足使用需求时，可以编写自定义校验。自定义校验需要编码在`data`下，在rules中引用即可：

```js
data() {
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          callback(new Error('接口地址格式不正确'))
        }
      } else {
        callback(new Error('接口地址不允许为空'))
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      methodOptions,
      rules: {
        number: [{ required: true, message: '接口编码不允许为空', trigger: 'blur' }],
        name: [{ required: true, message: '接口名称不允许为空', trigger: 'blur' }],
        address: [{ required: true, trigger: 'blur', validator: validateSourceUri }]
      }
    }
}
```
