---
title: echarts
date: 2020-03-18 11:16:12
tags:
 - Vue
 - 前端插件
 
categories:
 -  前端
---

所有的表格都需要在一个声明的`div`中进行承载
例如：
```js
<div ref="relyOn" class="app-container" style="width: 1100px; height: 800px" />
```

查找手册配置相应的配置项即可。

## 关系图
![](https://s2.ax1x.com/2020/02/04/1BVF5n.png)

```js
createEcharts() {
      const myChart = this.$echarts.init(this.$refs.relyOn)
      // 图例
      const categories = [{ name: '虚拟节点' }, { name: '实际节点' }]
      const option = {
        title: {
          text: '',
          left: '3%',
          top: '3%',
          textStyle: {
            color: '#000',
            fontSize: '30'
          }
        },
        legend: [{
          orient: 'horizontal',
          x: 'right',
          padding: [
            10, // 上
            10, // 右
            10, // 下
            10 // 左
          ],
          // selectedMode: 'single',
          data: categories.map(function(a) {
            return a.name
          })
        }],
        tooltip: {
          formatter: function(param) {
            var texts = []
            if (param.value) {
              texts.push('节点名称: ' + param.value.realName)
              texts.push('节点编号: ' + param.value.number)
              texts.push('版本号：' + param.value.version)
              if (param.value.virtualStepCode) {
                texts.push('虚拟节点编号：' + param.value.virtualStepCode)
              } else {
                texts.push('虚拟节点编号：无')
              }
              texts.push('说明: ' + param.value.description)
              return texts.join('<br />')
            }
          }
        },
        series: [{
          data: this.analysis(),
          links: this.analysis_link(),
          categories: categories,
          type: 'graph',
          top: '10%',
          roam: true,
          focusNodeAdjacency: true,
          force: {
            repulsion: 1000,
            edgeLength: [150, 100]
          },
          layout: 'force',
          label: { // 关系对象上的标签
            normal: {
              show: false,
              position: 'right',
              offset: [999999999, 999999999]
            }
          },
          edgeSymbol: ['arrow'],
          lineStyle: {
            normal: {
              color: 'target',
              width: 3,
              type: 'solid',
              opacity: 0.5,
              curveness: 0
            }
          }
        }],
        animationEasingUpdate: 'quinticInOut',
        animationDurationUpdate: 100
      }
      option.title.text = this.name
      myChart.setOption(option)
      // 设置鼠标拖动图形不还原
      myChart.on('mouseup', function(params) {
        var option = myChart.getOption()
        option.series[0].data[params.dataIndex].x = params.event.offsetX
        option.series[0].data[params.dataIndex].y = params.event.offsetY
        option.series[0].data[params.dataIndex].fixed = true
        myChart.setOption(option)
      })
      var _this = this
      myChart.on('click', function(param) {
        if (param.dataType == 'node') {
          console.log('node')
          _this.showNodeDialog(param.data.value)
        } else {
          if (param.data.category) {
            console.log('category')
            var info = {}
            var routeInfo = param.data
            info['sourceName'] = _this.nameRealNameMap[routeInfo['target']]
            info['sourceNumber'] = _this.nameNumberMap[routeInfo['target']]
            info['targetName'] = _this.nameRealNameMap[routeInfo['source']]
            info['targetNumber'] = _this.nameNumberMap[routeInfo['source']]
            info['category'] = routeInfo['category']
            _this.showCategoryDialog(info)
            console.log(info)
          }
        }
      })
    }
```

## 折线图
![](https://s2.ax1x.com/2020/02/07/1ch8wF.png)

```js
    createEcharts() {
      const myChart = this.$echarts.init(this.$refs.apiTrend)
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        // title: {
        //   left: 'center',
        //   text: '调用趋势图'
        // },
        grid: {
          left: '5%', // 距离div左边的距离
          right: '11%', // 距离div右边的距离
          containLabel: true
        },
        legend: {
          orient: 'vertical', // 垂直显示
          y: 'center', // 延Y轴居中
          x: 'right', // 居右显示
          padding: [
            5, // 上
            10, // 右
            5, // 下
            10 // 左
          ],
          // 图例
          data: ['总调用量', '成功次数', '失败次数', '命中次数', '平均响应时长', '平均成功响应时长', '平均命中响应时长'],
          inactiveColor: '#999',
          // 图例 默认选中
          selected: {
            '总调用量': true,
            '成功次数': false,
            '失败次数': false,
            '命中次数': false,
            '平均响应时长': false,
            '平均成功响应时长': false,
            '平均命中响应时长': false
          }
        },
        // grid: {top: '55%'},
        // 工具栏
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        // 横轴
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateList
        },
        // 纵轴
        yAxis: [
          {
            type: 'value',
            name: '调用量（次）',
            position: 'left',
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            type: 'value',
            name: '响应时长（毫秒）',
            position: 'right',
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        // 滑动窗口 默认长度0~10%
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 10
        }, {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        // 设置数据
        series: [
          {
            // 名称
            name: '总调用量',
            // 使用y轴索引
            yAxisIndex: 0,
            // 样式
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // 颜色
            itemStyle: {
              color: '#006ec0'
            },
            seriesLayoutBy: 'row',
            // 数据
            data: this.totalCount
          },
          {
            name: '成功次数',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'green'
            },
            seriesLayoutBy: 'row',
            data: this.successCount
          },
          {
            name: '失败次数',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#B03A5B'
            },
            seriesLayoutBy: 'row',
            data: this.failCount
          },
          {
            name: '命中次数',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#00BFFF'
            },
            seriesLayoutBy: 'row',
            data: this.hittedCount
          },
          {
            name: '平均响应时长',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#795DB3'
            },
            seriesLayoutBy: 'row',
            data: this.invokeTime
          },
          {
            name: '平均成功响应时长',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#869B74'
            },
            seriesLayoutBy: 'row',
            data: this.invokeTimeSuccess
          },
          {
            name: '平均命中响应时长',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#4B0082'
            },
            seriesLayoutBy: 'row',
            data: this.invokeTimeHitted
          }
        ]
      }
      myChart.setOption(option)
      this.chart = myChart
    }
```
## 柱状图
![](https://s2.ax1x.com/2020/02/07/1chbfs.png)

```js
createEchartsBar() {
  const myChart = this.$echarts.init(this.$refs.apiBar)
  const option = {
    // 标题、标题位置
    title: {
      text: this.bar.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    // 图例
    legend: {
      orient: 'vertical', // 垂直显示
      y: 'center', // 延Y轴居中
      x: 'right', // 居右显示
      padding: [
        5, // 上
        10, // 右
        5, // 下
        10 // 左
      ],
      data: ['总计', '成功', '失败']
    },
    // 工具栏
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    grid: {
      bottom: '25%'
    },
    // 窗口滑块 默认从0%~100%
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        start: 94,
        end: 100
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: 'empty',
        width: 30,
        height: '65%',
        showDataShadow: false,
        left: '91%'
      }
    ],
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: this.bar.xAxis,
        axisLabel: {// 坐标轴刻度标签的相关设置。
          interval: 0,
          rotate: '45',
          // 横坐标自定义模板 长度超过6进行截取用...代替
          formatter: function(name) {
            return (name.length > 6 ? (name.slice(0, 5) + '...') : name)
          }
        }
      }
    ],
    yAxis: [
      {
        name: '调用量(次)',
        type: 'value'
      }
    ],
    series: [
      {
        name: '总计',
        type: 'bar',
        data: this.bar.totalCount,
        barGap: 0
      },
      {
        name: '成功',
        type: 'bar',
        data: this.bar.successCount,
        barGap: 0
      },
      {
        name: '失败',
        type: 'bar',
        data: this.bar.failCount,
        barGap: 0
      }
    ]
  }

  myChart.setOption(option)
  this.chartBar = myChart
}

```
