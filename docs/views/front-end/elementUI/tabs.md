---
title: Tabs标签页
date: 2020-03-18 11:28:52
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---


分隔内容上有关联但属于不同类别的数据集合。
<br>
见[Tabs 标签页->自定义增加标签页触发器](https://element.eleme.cn/#/zh-CN/component/tabs)

## 应用

1. 使用`el-row` `el-col`将`el-tabs`包含起来，可以避免tab页导致页面卡死
2. 当数据不存在时，应返回`{}`，避免出现`undefined`导致页面渲染失败
3. 通过指定`editableTabsValue`切换tab页，对应的是tab对象的`name`属性，例如`'1'`、`'2'`。但应注意`name!==下标`
4. 通过比对`editableTabsValue`和`name`获取当前展示的对象的下标`currentIndex`，进行相应的数据展示

```vue
<div class="filter-container">
<el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addTab(editableTabsValue)">
  添加
</el-button>
<el-row>
  <el-col :span="24">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      style="margin-top: 20px"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="(item, index) in response.tables.table"
        :key="item.name"
        :label="item.tableName"
        :name="item.name"
      >
        <el-card style="position: relative;">
          <div slot="header" class="clearfix">
            <span>表信息</span>
          </div>
          <div>
            <el-row :gutter="10" style="text-align: center; margin-top: 20px">
              <el-col :span="4">
                <el-form label-position="right" label-width="140px" style="text-align: left">
                  <el-form-item label="库名称:">
                    <el-input v-model="response.tables.table[currentIndex].dbName" />
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" label-width="140px" style="text-align: left">
                  <el-form-item label="表名称:">
                    <el-input v-model="response.tables.table[currentIndex].tableName" />
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="6">
                <el-form label-position="right" label-width="140px" style="text-align: left">
                  <el-form-item label="多行:">
                    <el-select v-model="response.tables.table[currentIndex].single_data">
                      <el-option
                        v-for="item in nullTableOptions"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="6">
                <el-form label-position="right" label-width="140px" style="text-align: left">
                  <el-form-item label="数据来源节点:">
                    <el-input v-model="response.tables.table[currentIndex].dataNode" />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card style="position: relative; margin-top: 10px">
          <div slot="header" class="clearfix">
            addField
          </div>
          <div class="filter-container">
            <el-button-group style="float: left;">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addAddField">
                添加
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-minus"
                @click="deleteAddField"
              >
                删除
              </el-button>
            </el-button-group>
            <el-table
              :key="tableKey"
              ref="multipleTable"
              :data="response.tables.table[currentIndex].addFields.addField"
              border
              fit
              highlight-current-row
              style="width: 100%; margin-top: 20px "
              max-height="500"
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
              />
              <el-table-column label="序号" width="50px" align="center" type="index" />
              <el-table-column label="key" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.key" />
                </template>
              </el-table-column>
              <el-table-column label="value" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.value" />
                </template>
              </el-table-column>
              <el-table-column label="type" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.type" />
                </template>
              </el-table-column>
              <el-table-column label="format" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.format" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card style="position: relative; margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>mutiAddFields</span>
          </div>
          <div class="filter-container">
            <el-button-group style="float: left;">
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-plus"
                @click="addMutiAddFields"
              >
                添加
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-minus"
                @click="deleteMutiAddFields"
              >
                删除
              </el-button>
            </el-button-group>
            <el-table
              :key="tableKey"
              ref="multipleAddFieldlist"
              :data="response.tables.table[currentIndex].multiAddFields.addField"
              border
              fit
              highlight-current-row
              style="width: 100%; margin-top: 20px "
              max-height="500"
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
              />
              <el-table-column label="序号" width="50px" align="center" type="index" />
              <el-table-column label="key" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.key" />
                </template>
              </el-table-column>
              <el-table-column label="value" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.value" />
                </template>
              </el-table-column>
              <el-table-column label="type" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.type" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card style="position: relative; margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>mapping</span>
          </div>
          <div class="filter-container">
            <el-button-group style="float: left;">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addMapping">
                添加
              </el-button>
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-minus" @click="deleteMapping">
                删除
              </el-button>
            </el-button-group>
            <el-table
              :key="tableKey"
              ref="mappingList"
              :data="response.tables.table[currentIndex].mappings.mapping"
              border
              fit
              highlight-current-row
              style="width: 100%; margin-top: 20px "
              max-height="500"
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
              />
              <el-table-column label="序号" width="50px" align="center" type="index" />
              <el-table-column label="resultKey" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.resultKey" />
                </template>
              </el-table-column>
              <el-table-column label="tableMeta" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.tableMeta" />
                </template>
              </el-table-column>
              <el-table-column label="type" min-width="120px" align="center" show-overflow-tooltip>
                <template slot-scope="{row}">
                  <el-input v-model="row.type" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-col>
</el-row>
</div>

```

```js
getCurrentIndex() {
  for (let i = 0; i < this.response.tables.table.length; i++) {
    if (this.response.tables.table[i].name === this.editableTabsValue) {
      console.log('in')
      this.currentIndex = i
      return
    }
  }
},
addTab(targetName) {
  const newTabName = ++this.tabindex + ''
  this.response.tables.table.push({
    tableName: 'New Table',
    name: newTabName,
    dataNode: '',
    dbName: '',
    single_data: false,
    'addFields': {
      'addField': []
    },
    'multiAddFields': {
      'addField': []
    },
    'mappings': {
      'mapping': []
    }
  })
  this.editableTabsValue = newTabName
},
removeTab(targetName) {
  const tabs = this.response.tables.table
  let activeName = this.editableTabsValue
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  this.editableTabsValue = activeName
  this.response.tables.table = tabs.filter(tab => tab.name !== targetName)
  this.getCurrentIndex()
}
```

