---
title: html2canvas - 网页转图片下载
date: 2020-03-18 11:16:12
tags:
 - Vue
 - 前端插件
 
categories:
 -  前端
---

 ## html2canvas
 [html2canvas](http://html2canvas.hertzen.com/)是一个将页面转成图片并能进行下载的工具。
 
 将需要下载的内容划分到一个div中，并通过绑定ref进行下载。生成图片后，生成相应的资源a标签，通过模拟点击达到自动下载的作用。
 
 ```vue
     <el-dialog
       :visible.sync="dialogFormVisible"
       width="90%"
       top="5vh"
       :destroy-on-close="true"
       @closed="dialogFormVisible=false"
     >
       <div style="width: 100%;height: 70vh;overflow: auto">
         <div ref="process">
           <el-card style="position: relative;">
             <div slot="header" class="clearfix">
               <h3>回溯跑批信息</h3>
             </div>
             <div>
               <el-table
                 :key="tableKey"
                 :data="detailBatchProdInfo"
                 border
                 fit
                 highlight-current-row
                 style="width: 100%;margin-top: 10px"
               >
                 <el-table-column label="任务id" show-overflow-tooltip align="center">
                   <template slot-scope="{row}">
                     <span>{{ row.taskId }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column label="文件名称" show-overflow-tooltip align="center">
                   <template slot-scope="{row}">
                     <span>{{ row.fileName }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column label="产品编码" align="center">
                   <template slot-scope="{row}">
                     <span>{{ row.prodCode }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column label="产品名称" align="center">
                   <template slot-scope="{row}">
                     <span>{{ row.prodName }}</span>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
           </el-card>
           <el-card style="position: relative; margin-top: 20px">
             <div slot="header" class="clearfix">
               <h3>已执行流程</h3>
             </div>
             <div style="padding-top: 10px;">
               <el-button-group style="padding-left: 35px">
                 <el-button :type="!reverse? 'primary' : ''" @click="reverse=false">正序</el-button>
                 <el-button :type="reverse? 'primary' : ''" @click="reverse=true">倒序</el-button>
                 <el-button type="primary" @click="generatorImage">下载</el-button>
               </el-button-group>
               <h4 style="float: right;padding-right: 5px">耗时：{{ getUsedTime() }}</h4>
             </div>
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
             <div />
           </el-card>
         </div>
       </div>
 
     </el-dialog>
 ```
 
 ```js
 generatorImage() {
   html2canvas(this.$refs.process, { useCORS: true }).then(canvas => {
     // 通过a标签下载到本地
     const link = document.createElement('a')
 
     const imgData = canvas.toDataURL({ format: 'png', multiplier: 4 })
     const blob = this.dataURLtoBlob(imgData)
     const objurl = URL.createObjectURL(blob)
 
     link.download = this.downloadName + '.png'
 
     link.href = objurl
 
     link.click()
   })
 }
 ```
