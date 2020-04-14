---
title: 选择器
date: 2020-03-18 11:55:31
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---

当选项过多时，使用下拉菜单展示并选择内容。
<br>
见[Select 选择器](https://element.eleme.cn/#/zh-CN/component/select)

## 普通模板

| 参数     | 说明   |
| -------- | ------ |
| label    | 下拉选中展示的内容 |
| value    | 选中下拉选的值 |

```vue
<el-select v-model="postForm.method" class="filter-item" style="width: 550px">
  <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
</el-select>
```

```js
const methodOptions = [
  { key: 1, display_name: 'GET' },
  { key: 2, display_name: 'POST' }
]
```
![](https://s2.ax1x.com/2020/02/14/1jaDvF.png)

## 自定义模板

可以自定义备选项，将自定义的 HTML 模板插入el-option的 slot 中即可。

```vue
 <el-select v-model="postForm.interfaceId" class="filter-item" filterable style="width: 550px">
  <el-option
    v-for="item in interfaceList"
    :key="item.id"
    :label="item.number"
    :value="item.id"
  >
    <span style="float: left">{{ item.number }}</span>
    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
  </el-option>
</el-select>
```
![](https://s2.ax1x.com/2020/02/15/1xreED.png)

## 可搜索
为`el-select`添加`filterable`属性即可启用搜索功能。默认情况下，Select 会找出所有`label`属性包含输入值的选项。如果希望使用其他的搜索逻辑，可以通过传入一个`filter-method`来实现。`filter-method`为一个Function，它会在输入值发生变化时调用，参数为当前输入值。

### 普通搜索

添加`filterable`即可
```vue
<el-select v-model="postForm.virtualStepCode" class="filter-item" style="width: 550px" filterable clearable>
  <el-option v-for="item in virtualStepCodeOptions" :key="item.id" :label="item.number + '>' + item.version" :value="item.number + '>' + item.version" />
</el-select>
```
### 自定义搜索

设置属性，并指定过滤方法

```vue
<el-select
    v-model="listQuery.interfaceId"
    placeholder="接口名称"
    clearable
    class="filter-item"
    style="width: 100%"
    filterable
    :filter-method="dataFilter"
    @clear="clearFilter"
    @visible-change="clearFilter"
  >
    <el-option
      v-for="item in interfaceOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
      <span style="float: left; color: #8492a6; font-size: 13px">{{ item.name }}</span>
      <span style="float: right;color: #8492a6; font-size: 13px">{{ item.number }}</span>
    </el-option>
 </el-select>
```

filter-method:
```js
dataFilter(val) {
  if (val) { // val存在
    this.interfaceOptions = this.interfaceOptionsCopy.filter((item) => {
      if (!!~item.number.indexOf(val) || !!~item.number.toUpperCase().indexOf(val.toUpperCase()) ||
      !!~item.name.indexOf(val) || !!~item.name.toUpperCase().indexOf(val.toUpperCase())) {
        return true
      }
    })
  } else { // val为空时，还原数组
    this.interfaceOptions = this.interfaceOptionsCopy
  }
}
```

## 可清空

为`el-select`设置`clearable`属性，则可将选择器清空。需要注意的是，`clearable`属性仅适用于单选。

:::tip 说明
代码见上面
:::




