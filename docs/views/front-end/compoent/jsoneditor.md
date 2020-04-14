---
title: json编辑器
date: 2020-03-18 11:16:12
tags:
 - Vue
 - 前端插件
 
categories:
 -  前端
---

一个json的查看、编辑、校验、格式化工具。<br/>
[github](https://github.com/josdejong/jsoneditor)

## 安装

```shell script
npm install jsoneditor
```

在`main.js`中引用
```js
import jsoneditor from 'docs/views/front-end/compoent/jsoneditor'

Vue.use('jsoneditor', jsoneditor)
```

## 定义container
```html
 <div>
   <div style="position: relative; height: 500px; width: 100%;">
     <div id="auto">
       <div id="contents">
         <input id="id" type="hidden" name="id">
         <div id="codeEditor" />

         <div id="splitter">
           <div id="buttons">
             <div>
               <el-button
                 id="toTree"
                 class="convert"
                 title="Copy code to tree editor (Ctrl + >)"
                 @click="toTree"
               >
                 <div class="convert-right" />
               </el-button>
             </div>
             <div>
               <el-button
                 id="toCode"
                 class="convert"
                 title="Copy tree to code editor (Ctrl + <)"
                 @click="toCode"
               >
                 <div class="convert-left" />
               </el-button>
             </div>
           </div>
           <div id="drag" />
         </div>

         <div id="treeEditor" />
       </div>
     </div>
   </div>
 </div>
``` 

## 构造

```js

// 获取container对象
var treeContainer = document.getElementById('treeEditor')
// 声明配置项
var treeOptions = {
      autocomplete: {
        getOptions: function() {
          return ['jsonpath: ', 'css: ', 'xpath: ', 'pattern: ', 'java: ', 'url', 'type', 'method',
            'requestBody', 'timeout', 'proxy', 'param', 'headers', 'parse', 'passParam', 'checks',
            'result', 'website', 'retry', 'backNum', '$.', '$.mobileNum', '$.password', 'okHttp',
            'jsoup', 'post', 'get', 'spiderName', 'spiderCnName', 'spiderRule', 'resultRule',
            '$.step0.', '$.parse', 'regcanal'
          ]
        }
      },
      // schema: schema,
      templates: [{
        text: 'Jsonpath',
        title: 'Insert a jsonpath Node',
        field: 'key',
        value: 'jsonpath: $.'
      },
      {
        text: 'CSS',
        title: 'Insert a css Node',
        field: 'key',
        value: 'css: '
      },
      {
        text: 'Xpath',
        title: 'Insert a xpath Node',
        field: 'key',
        value: 'xpath: '
      },
      {
        text: 'Pattern',
        title: 'Insert a pattern Node',
        field: 'key',
        value: 'pattern: '
      },
      {
        text: 'Java-imei',
        title: 'Insert a Java Node',
        field: 'imei',
        value: 'java: {"method": "imei"}'
      }, {
        text: 'Java-uuid',
        title: 'Insert a Java Node',
        field: 'uuid',
        value: 'java: {"method": "uuid"}'
      }, {
        text: 'Java-timestamp',
        title: 'Insert a Java Node',
        field: 'timestamp',
        value: 'java: {"method": "timestamp"}'
      }, {
        text: 'Java-timestamp2',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "timestamp", "params": ["1000"]}'
      }, {
        text: 'Java-random',
        title: 'Insert a Java Node',
        field: 'random',
        value: 'java: {"method": "random"}'
      }, {
        text: 'Java-random2',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "random", "params": ["范围, 最终取0到当前填的值"]}'
      }, {
        text: 'Java-date',
        title: 'yyyy-MM-dd HH:mm:ss',
        field: 'date',
        value: 'java: {"method": "date"}'
      }, {
        text: 'Java-date2',
        title: 'Insert a Java Node',
        field: 'date',
        value: 'java: {"method": "date", "params": ["时间格式"]}'
      }, {
        text: 'Java-md5',
        title: 'Insert a Java Node',
        field: 'md5',
        value: 'java: {"method": "md5", "params": ["原始字符串"]}'
      }, {
        text: 'Java-sha1',
        title: 'Insert a Java Node',
        field: 'sha1',
        value: 'java: {"method": "sha1", "params": ["原始字符串"]}'
      }, {
        text: 'Java-jsDes',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "jsDes", "params": ["原始字符串"]}'
      }, {
        text: 'Java-jsDes2',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "jsDes", "params": ["原始字符串","密钥1","密钥2","密钥3"]}'
      }, {
        text: 'Java-jsonUa',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "jsonUa", "params": ["token"]}'
      }, {
        text: 'Java-base64',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "base64", "params": ["原始字符串", "encode/decode"]}'
      }, {
        text: 'Java-rsa',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "rsa", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥"]}'
      }, {
        text: 'Java-des',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "des", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥"]}'
      }, {
        text: 'Java-des2',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "des", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥",  "ivKey"]}'
      }, {
        text: 'Java-tripleDes',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "tripleDes", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥",  "ivKey"]}'
      }, {
        text: 'Java-aes',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "aes", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥"]}'
      }, {
        text: 'Java-aes2',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "aes", "params": ["原始字符串", "encrypt/decrypt", "base64/hex", "密钥",  "ivKey"]}'
      }, {
        text: 'Java-aes3',
        title: 'Insert a Java Node,key is hexString',
        field: 'key',
        value: 'java: {"method": "aesHexKey", "params": ["原始字符串", "encrypt/decrypt", "密钥"]}'
      }, {
        text: 'Java-zip',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "zip", "params": ["原始字符串", "zip/unzip"]}'
      }, {
        text: 'Java-rsaSign',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "rsaSign", "params": ["原始字符串", "密钥"]}'
      }, {
        text: 'Java-excuteJs',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "excuteJs", "params": ["js代码", "js方法"]}'
      }, {
        text: 'Java-caseTrans',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"method": "caseTrans", "params": ["原始字符串", "upper/lower"]}'
      }, {
        text: 'Java-pattern',
        title: 'Insert a Java Node',
        field: 'pattern',
        value: 'java: {"method": "pattern", "params": ["原始串", "正则表达式"]}'
      }, {
        text: 'Java-hmacSha1',
        title: 'Insert a Java Node',
        field: 'pattern',
        value: 'java: {"method": "hmacSHA1", "params": ["原始串", "密钥"]}'
      }, {
        text: 'Java-other',
        title: 'Insert a Java Node',
        field: 'key',
        value: 'java: {"class":"", "method": "", "params": [""]}'
      }
      ],
      mode: 'tree', // 编辑器模式 ['tree': 树形模式, 'code': 代码模式, 'view': 查看模式]
 }

// 构造对象 
treeEditor = new JSONEditor(treeContainer, treeOptions, jsonTemp)

// 打开树形结构
treeEditor.expandAll()
```

## 获取与赋值

```js
// 获取
editor.get()

// 赋值
editor.set()
```

## 按钮

### 代码模式转换树形模式
```vue
 <div>
   <el-button
     id="toTree"
     class="convert"
     title="Copy code to tree editor (Ctrl + >)"
     @click="toTree"
   >
     <div class="convert-right" />
   </el-button>
 </div>
```

```js
toTree(){
    treeEditor.set(codeEditor.get())
    treeEditor.expandAll()
}
```

### 树形模式转换代码模式

```vue
<div>
   <el-button
     id="toCode"
     class="convert"
     title="Copy tree to code editor (Ctrl + <)"
     @click="toCode"
   >
     <div class="convert-left" />
   </el-button>
 </div>
</div>
```

```js
toCode(){
  codeEditor.set(treeEditor.get())
}
```

## 拖动块

拖动拖动块 可以改变左右编辑器的大小

```vue
<div id="drag" />
```

```js
tcredit.splitter = new Splitter({
  container: document.getElementById('drag'),
  change: function() {
    tcredit.resize()
  }
})
```

```js
tcredit.resize = function() {
    var e = document.getElementById('menu')
    var t = document.getElementById('treeEditor')
    var i = document.getElementById('codeEditor')
    var n = document.getElementById('splitter')
    var r = document.getElementById('buttons')
    var o = document.getElementById('drag')
    var a = 15
    var l = parseInt((window.innerWidth || document.body.offsetWidth || document.documentElement.offsetWidth) * 0.9)
    var c = 0
    if (c && (l -= c + a),
    tcredit.splitter) {
      tcredit.splitter.setWidth(l)
      var h = tcredit.splitter.getValue()
      var d = h > 0
      var u = h < 1
      var p = d && u
      r.style.display = p ? '' : 'none'
      var f; var m = n.clientWidth
      if (d) {
        if (u) {
          f = l * h - m / 2
          var g = util.getInternetExplorerVersion() === 8
          o.innerHTML = g ? '|' : '&#8942;',
          o.title = 'Drag left or right to change the width of the panels'
        } else {
          f = l * h - m,
          o.innerHTML = '&lsaquo;',
          o.title = 'Drag left to show the tree editor'
        }
      } else {
        f = 0,
        o.innerHTML = '&rsaquo;',
        o.title = 'Drag right to show the code editor'
      }
      i.style.display = h === 0 ? 'none' : '',
      i.style.width = Math.max(Math.round(f), 0) + 'px',
      codeEditor.resize(),
      o.style.height = n.clientHeight - r.clientHeight - 2 * a - (p ? a : 0) + 'px',
      o.style.lineHeight = o.style.height,
      t.style.display = h === 1 ? 'none' : '',
      t.style.left = Math.round(f + m) + 'px',
      t.style.width = Math.max(Math.round(l - f - m - 2), 0) + 'px'
    }
    e && (c ? e.style.right = a + (c + a) + 'px' : e.style.right = a + 'px')
  }
```
