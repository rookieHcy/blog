---
title: 时间线
date: 2020-03-18 11:21:59
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---


可视化地呈现时间流信息。详细配置见ElementUI组件[Timeline](https://element.eleme.cn/#/zh-CN/component/timeline)

| 参数     | 说明   |
| -------- | ------ |
| timestamp    | 时间戳 |
| placement  | 时间戳位置 top / bottom |
| type  | 节点类型 primary / success / warning / danger / info |                                         
| color  | 节点颜色 hsl / hsv / hex / rgb |                                         
| size  | normal / large |                                         
| icon  | 节点图标 |                                         

## 例子
```vue
<el-timeline :reverse="reverse" style="padding-top: 20px">
  <el-timeline-item
    v-for="(item,index) of timeline"
    :key="index"
    :timestamp="formatTime(item.invokeTime)"
    placement="top"
    :icon="iconArr[item.operate]"
    :type="typeArr[item.status]"
    size="large"
  >
    <el-card>
      <h4>{{ item.description }}</h4>
      <el-table
        :key="tableKey"
        :data="item.info"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 10px"
      >
        <el-table-column label="入参" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <span v-if="row.request">{{ row.request }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="出参" align="center">
          <template slot-scope="{row}">
            <span v-if="row.response">{{ row.response }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="异常" align="center">
          <template slot-scope="{row}">
            <span v-if="row.exception">{{ row.exception }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-timeline-item>
</el-timeline>
```

![](https://s2.ax1x.com/2020/02/06/1yvRQe.png)
