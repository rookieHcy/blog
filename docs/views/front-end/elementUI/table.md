---
title: 表格
date: 2020-03-18 11:21:59
tags:
 - Vue
 - ElementUI
categories:
 -  前端
---


用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。
<br>
见[Table 表格](https://element.eleme.cn/#/zh-CN/component/table)

## 基本表格
当`el-table`元素中注入`data`对象数组后，在`el-table-column`中用`prop`属性来对应对象中的键名即可填入数据，用`label`属性来定义表格的列名。可以使用`width`属性来定义列宽。
<br>
默认情况下，`Table` 组件是不具有竖直方向的边框的，如果需要，可以使用`border`属性，它接受一个`Boolean`，设置为`true`即可启用。
<br>
横向内容过多时，可选择固定列。固定列需要使用`fixed`属性，它接受 `Boolean` 值或者`left`、`right`，表示左边固定还是右边固定。
<br>
对表格进行排序，可快速查找或对比数据。
<br>
在列中设置`sortable`属性即可实现以该列为基准的排序，接受一个`Boolean`，默认为`false`。可以通过 `Table` 的d`efault-sort`属性设置默认的排序列和排序顺序。可以使用`sort-method`或者`sort-by`使用自定义的排序规则。如果需要后端排序，需将`sortable`设置为`custom`，同时在 `Table` 上监听`sort-change`事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。

例子：
```vue
  <el-table
    :key="tableKey"
    ref="multipleTable"
    v-loading="listLoading"
    :data="list"
    border
    fit
    highlight-current-row
    style="width: 100%;"
    @sort-change="sortChange"
  >
    <el-table-column
      v-if="hasBtnPermission('product:batchPublish')"
      type="selection"
      width="50"
      align="center"
      :selectable="selectable"
    />
    <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" type="index" />
    <el-table-column label="产品编码" min-width="220px" align="center" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.number }}</span>
      </template>
    </el-table-column>
    <el-table-column label="产品名称" min-width="235px" align="center" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="版本号" width="80" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.version }}</span>
      </template>
    </el-table-column>
  </el-table>
```


## 合并单元格
当要实现下图所示多行或多列共用一个数据时，可以使用到合并行或列。
![](https://s2.ax1x.com/2020/02/16/3pwPVU.png)

通过给`table`传入`span-method`方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行`row`、当前列`column`、当前行号`rowIndex`、当前列号`columnIndex`四个属性。该函数可以返回一个包含两个元素的数组，第一个元素代表`rowspan`，第二个元素代表`colspan`。 也可以返回一个键名为`rowspan`和`colspan`的对象。
可以想象所有的表格中的行列都是真实存在的，通过维护`合并数组`控制合并后的样式
如`spanArr=[2,0,3,0,0]` 代表 合并第一二个单元格、第三四五个单元格 
```vue
 <el-table
      :key="tableKey"
      ref="multipleTable"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px "
      :span-method="cellMerge"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column label="序号" width="50px" align="center" type="index" :index="jsonIndex"/>
      <el-table-column label="JSON名称" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.jsonId>0">{{scope.row.jsonName}}</span>
          <el-input v-else v-model="scope.row.jsonName" @change="handlerJsonName(scope.row.jsonName, scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="50px" align="center" type="index" :index="paramIndex" />

      <el-table-column label="参数名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="row.keyId>0">{{row.paramName}}</span>
          <el-input v-else v-model="row.paramName" />
        </template>
      </el-table-column>
      <el-table-column label="数值来源" width="140px" align="center">
        <template slot-scope="{row}">
          <el-select v-model="row.valueSource" @change="handlevalueSourceCahnge(row)">
            <el-option v-for="item in valueSourceOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="参数值" min-width="200px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-select v-if="row.valueSource==2" v-model="row.value" style="width: 100%" filterable>
            <el-option v-for="item in cxtList" :key="item" :label="item" :value="item" />
          </el-select>

          <el-select v-else-if="row.valueSource==6" v-model="row.value" style="width: 100%" filterable>
            <el-option
              v-for="item in methodList"
              :key="item.id"
              :label="item.name"
              :value="item.className"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px">{{ item.className }}</span>
            </el-option>
          </el-select>
          <el-input v-else v-model="row.value" />
        </template>
      </el-table-column>
      <el-table-column label="数据类型" width="120px" align="center">
        <template slot-scope="{row}">
          <el-select v-if="row.valueSource==4" v-model="row.dataType">
            <el-option v-for="item in dataTypeOptionsJson" :key="item.key" :label="item.value" :value="item.key" :disabled="item.disabled" />
          </el-select>

          <el-select v-else-if="row.valueSource==5" v-model="row.dataType">
            <el-option v-for="item in dataTypeOptionsArray" :key="item.key" :label="item.value" :value="item.key" :disabled="item.disabled" />
          </el-select>

          <el-select v-else v-model="row.dataType">
            <el-option v-for="item in dataTypeOptions" :key="item.key" :label="item.value" :value="item.key" :disabled="item.disabled" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否必填" width="120px" align="center">
        <template slot-scope="{row}">
          <el-select v-model="row.required">
            <el-option v-for="item in requiredOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="addOutParam(scope.$index, scope.row)">
            增加
          </el-button>
          <el-button v-if="scope.row.keyDeletable==0" size="mini" type="success" disabled>
            删除
          </el-button>
          <el-button v-else size="mini" type="success" @click="deleteOutParam(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
```

cellMerge方法：
```js
cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= 2) { // 对第一列进行合并
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
```
### 动态增减

动态增减表格分为`整行添加`、`整行删除`、`行内增加`、`行内删除`四种

- 整行增加

整行增加一定是在当前表格的最后添加，所以只需要在`数据数组`push一个对象、`合并单元格数组`push`1`即可（因为此时一定不存在合并的单元格或者理解为合并的单元格个数为1）
```js
addTable() {
      var obj = {}
      obj['jsonId'] = 0
      obj['jsonName'] = ''
      obj['jsonDeletable'] = 1

      obj['keyId'] = 0
      obj['valueId'] = 0
      obj['paramName'] = ''
      obj['valueSource'] = 1
      obj['value'] = ''
      obj['dataType'] = 1
      obj['required'] = 1
      obj['desc'] = ''
      obj['keyDeletable'] = 1

      this.spanArr.push(1)
      this.list.push(obj)
    }
```

- 整行删除

整行删除是通过勾选复选框的方式，校验通过之后进行删除操作。
在删除的时候将选中的每一行的起始索引获取到，因为可能为多行，为了避免实时删除影响后续的删除（类似于后端的list倒序删除），第一次变量过程中将要删除的位置标记为`-1`，第二次遍历将所有值为`-1`的对象进行删除

```js
deleteTable() {
      const selection = this.$refs.multipleTable.selection

      if (selection.length === 0) {
        this.$message({
          message: '请勾选要删除的数据',
          type: 'warning'
        })
      } else {
        // 维护数据
        // 获取要删除的条数
        selection.forEach(selectItem => {
          const item = selectItem.index
          const deleteSize = this.spanArr[item]
          console.log('item=' + item + '; deleteSize=' + deleteSize)
          if (deleteSize && deleteSize > 0) {
            console.log('删除前：' + this.spanArr.join(','))
            // 做标记
            for (let i = item; i < item + deleteSize; i++) {
              this.spanArr[i] = -1
            }
            console.log('标记后：' + this.spanArr.join(','))
          }
        })

        for (var i = 0; i < this.spanArr.length; i++) {
          if (this.spanArr[i] === -1) {
            // 实际删除
            this.spanArr.splice(i, 1)
            this.list.splice(i, 1)
            i--
          }
        }
        console.log('删除后：' + this.spanArr.join(','))
      }
    }
```

- 行内添加

行内添加是通过行内数据操作栏中的`添加`按钮控制的。点击的位置可能是行内数据的`头部`、`尾部`、`中间`位置。通过找到合并数组中第一个不为0的数字进行自增，并在此位置push一个`0`来维护合并单元格。
:::tip 说明
假设`spanArr=[2,0,3,0,0]` 代表 合并第一二个单元格、第三四五个单元格，此时在第一行第二条数据位置点击添加
1. 获取点击添加按钮的数据index(框架维护)为 `1`；
2. 从下标为`1`开始，倒序查找到第一个不为`0`的对象。此时找到`spanArr[0] = 2`
3. 将`spanArr[0] = 2`自增，并在此数据后push`0`，此时数组为`spanArr=[3,0,,0,3,0,0]`
4. 合并操作完成
:::

例子：
```js
addOutParam(index, row) {
  console.log('index=' + index + ';')
  var obj = {}
  obj['jsonId'] = row.jsonId
  obj['jsonName'] = row.jsonName
  obj['jsonDeletable'] = row.jsonDeletable

  obj['keyId'] = 0
  obj['valueId'] = 0
  obj['paramName'] = ''
  obj['valueSource'] = 1
  obj['value'] = ''
  obj['dataType'] = 1
  obj['required'] = 1
  obj['desc'] = ''
  obj['keyDeletable'] = 1
  this.spanArr.splice(index + 1, 0, 0)
  for (let i = index; i >= 0; i--) {
    // 从当前索引开始 往前找第一个不为0的位置 加一 维护合并单元格的操作
    if (this.spanArr[i] > 0) {
      this.spanArr[i] += 1
      break
    }
  }
  console.log('spanArr=' + this.spanArr)
  this.list.splice(index + 1, 0, obj)
}
```
- 行内删除

行内添加是通过行内数据操作栏中的`删除`按钮控制的。删除时获取点击位置的索引(框架维护)，也对应着数据数组的下标，数据直接删除即可。维护合并单元格时，如果对应着合并单元格数组为1，代表此行数据需要移除；如果此处不为1，需要找到当前索引前第一个不为0的数据进行自减，然后删除一个0

:::tip 说明
假设`spanArr=[2,0,3,0,0]` 代表 合并第一二个单元格、第三四五个单元格，此时在第一行第二条数据位置点击删除
1. 此时获取到的索引index为1，数据直接进行删除
2. 判断合并单元格数组中此下标`spanArr[1]`是否为1
3. 因为`spanArr[1] = 0`，此时向前进行查找到第一个不为0的位置进行自减操作。即：`spanArr[0] = 2` 自减后为`span[0] = 1`；删除一个0维护位置；
4. 此时合并单元格数组为`spanArr=[1,3,0,0]`，代表 第一个单元格无合并、合并第二三四个单元格

此时第一行第一条数据进行删除
1. 此时获取到的索引index为0，数据直接进行删除
2. 判断合并单元格数组中此下标`spanArr[1]`是否为1
3. 因为`spanArr[0] = 1`，此时代表当前行只有一条数据，数据进行删除后，当前行应该整体移除
4. 移除`spanArr[0]`
5. 此时合并单元格数组为`spanArr=[3,0,0]`，代表 合并第一二三个单元格

:::

```js
deleteOutParam(index) {
  console.log('delete index is ' + index)
  // 移除数据
  this.list.splice(index, 1)
  // 移除spanArr中相应索引
  // 如果这个位置为1  则代表整行需要移除
  if (this.spanArr[index] === 1) {
    this.spanArr.splice(index, 1)
  } else {
    // 如果位置不为1  无论为什么 都需要找到索引数组 进行减一操作 然后随便删除一个0
    for (let i = index; i >= 0; i--) {
      // 从当前索引开始 往前找所有不为0的值 加一 维护表索引
      if (this.spanArr[i] !== 0) {
        this.spanArr[i]--
        this.spanArr.splice(i + 1, 1)
        break
      }
    }
  }
  console.log('spanArr=' + this.spanArr)
}
```

### 动态索引

通过给 `type=index` 的列传入 `index` 属性，可以自定义索引。该属性传入数字时，将作为索引的起始值。也可以传入一个方法，它提供当前行的行号（从 0 开始）作为参数，返回值将作为索引展示。
`index`是框架自己维护的，此处依据`index`值进行转换，生成一个自定义索引

- 整行索引

在`合并单元格数组`中进行查找，从当前索引开始，往前找所有不为0的值，计数，维护整行索引

:::tip 说明
假设`spanArr=[2,0,3,0,0]` 代表 合并第一二个单元格、第三四五个单元格
<br>
则整行索引的虚拟数组为`jsonIndex=[1,1,2,2,2]`
:::

```js
jsonIndex(index) {
  let count = 0
  for (let i = index; i >= 0; i--) {
    // 从当前索引开始 往前找所有不为0的值 加一 维护表索引
    if (this.spanArr[i] !== 0) {
      count++
    }
  }
  return count
}
```

- 行内索引

在`合并单元格数组`中进行查找，从当前索引开始，往前找第一个不为0的值，维护整行内引

:::tip 说明
假设`spanArr=[2,0,3,0,0]` 代表 合并第一二个单元格、第三四五个单元格
<br>
则行内索引的虚拟数组为`jparamIndex=[1,2,1,2,3]`
:::

```js
paramIndex(index) {
      for (let i = index; i >= 0; i--) {
    // 从当前索引开始 往前找第一个不为0的位置 维护字段索引
    if (this.spanArr[i] !== 0) {
      return index - i + 1
    }
  }
}
```

## 筛选
对表格进行筛选，可快速查找到自己想看的数据。
在列中设置`filters``filter-method`属性即可开启该列的筛选，`filters` 是一个数组，`filter-method`是一个方法，它用于决定某些数据是否显示，会传入三个参数：`value`, `row` 和 `column`。

![](https://s2.ax1x.com/2020/02/16/3p4QdH.png)

例子：
```vue
<el-table-column
  label="类型"
  min-width="220px"
  align="center"
  :filter-method="filterTag"
  :filters="[{ text: '数据产品', value: '1' }, { text: '数据节点', value: '2' }]"
>
  <template slot-scope="{row}">
    <span>{{ row.type | typeFielter }}</span>
  </template>
</el-table-column>
```

```js
filterTag(value, row) {
  return row.type == value
}
```
