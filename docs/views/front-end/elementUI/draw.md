---
title: 抽屉
date: 2020-03-18 11:20:08
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---
抽屉和对话框类似，但是有的时候使用抽屉能带来不同的UI体验，比如用在属性展示上

见[Drawer 抽屉](https://element.eleme.cn/#/zh-CN/component/drawer)

| 参数     | 说明   |
| -------- | ------ |
| title    | 抽屉标题 |
| visible.sync    | 展示/隐藏 |
| direction  | 打开方向 rtl / ltr / ttb / btt |

## 例子
```vue
<el-drawer
      title="数据源属性"
      :visible.sync="drawer"
      direction="rtl"
    >
  <el-form
    ref="postForm"
    :rules="rules"
    :model="postForm"
    label-position="right"
    label-width="100px"
    style="width: 400px;padding-left: 20px"
  >
    <el-form-item ref="name" label="名称" prop="name">
      <el-input v-model="postForm.name" />
    </el-form-item>
    <el-form-item ref="address" label="调用地址" prop="address">
      <el-input v-model="postForm.address" />
    </el-form-item>
    <el-form-item ref="contentType" label="请求头" prop="contentType">
      <el-input v-model="postForm.contentType" />
    </el-form-item>
    <el-form-item label="请求方法" prop="请求方法">
      <el-select v-model="postForm.method" class="filter-item" style="width: 280px">
        <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item ref="timeout" label="超时时间" prop="timeout">
      <el-input v-model="postForm.timeout" style="width: 280px">
        <template slot="append">毫秒</template>
      </el-input>
    </el-form-item>
    <el-form-item label="重试次数" prop="重试次数">
      <el-select v-model="postForm.retry" class="filter-item" style="width: 280px">
        <el-option v-for="n in 10" :key="n" :label="n - 1" :value="n - 1" />
      </el-select>
    </el-form-item>
    <el-form-item label="携带文件" prop="携带文件">
      <el-select v-model="postForm.withFile" class="filter-item" style="width: 280px">
        <el-option v-for="item in withFileOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否回调" prop="是否回调">
      <el-select v-model="postForm.callBack" class="filter-item" style="width: 280px">
        <el-option v-for="item in callBackOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
  </el-form>
  <div style="float: right; margin-right: 25px">
    <el-button @click="drawer = false">
      取消
    </el-button>
    <el-button type="primary" @click="editAttr">
      修改
    </el-button>
  </div>
</el-drawer>
```

![](https://s2.ax1x.com/2020/02/14/1XYu34.png)

:::tip 说明
使用`抽屉`需要elementUI2.13.0版本及以上
<br>
一般需要设置`destroy-on-close	`，避免打开时存在上一次遗留的操作记录
:::
