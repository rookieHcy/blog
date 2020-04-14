---
title: python爬取花瓣网图片-渐入佳境
date: 2020-03-20 00:56:04
tags:
 - Python
 - 爬虫
categories:
 -  后端
---

:::tip 系列文章
+ [python爬取花瓣网图片-初探茅庐](./SpiderDemo1.html)
+ [python爬取花瓣网图片-渐入佳境](./SpiderDemo2.html)
:::

<!-- more -->

## 重命名并新建py文件 <Badge text="Just Kidding" type="error"/>

![](https://s1.ax1x.com/2020/03/20/868ZG9.png)

## 理智分析
当页面滑动到一定高度时，会发送一个请求，页面数据进行更新。
参数：
```json
{
    k7yykour: 
    max: 2526385308
    limit: 20
    wfl: 1
}
```

其中`max`为当前页面最后一张图片的`pin_id`， `limit`为本次请求的图片数量。
猜想页面的图片按照`id`倒序排列，当滑动到一定高度时，将当前页面`最小id`作为参数，去后台请求新数据。
![](https://s1.ax1x.com/2020/03/20/86GZTS.png)

响应的json报文中`pins`为新图片页面的信息。<br/>
其中`pin_id`与`https://huaban.com/pins/`进行拼接可以弹出图片的查看窗口
![](https://s1.ax1x.com/2020/03/20/86GBOx.png)

`pins -> file -> key`与`http://hbimg.huabanimg.com/`进行拼接即为图片的链接地址
![](https://s1.ax1x.com/2020/03/20/86G2fH.png)
![](https://s1.ax1x.com/2020/03/20/86GT78.png)

## 编码开始

### 导包

```py
import requests
```

### 设置起始最大id
点击当前页面第一张图片，根据地址栏展示，获取该图片的`pin_id`作为起始最大id
![](https://s1.ax1x.com/2020/03/20/86Jenx.png)
```py
# 设置起始最大id
start_max = 2529333588
```

### 测试爬取
设置好请求必要信息，进行调用，返回结果格式与浏览器请求一致
```py
# 定义基础url
base_url = 'https://huaban.com/explore/dianyinghaibao'

# 定义参数
params = {
    'k7yykous': '',
    'max': start_max,
    'limit': '20',
    'wfl': '1',
}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
    'Accept': 'application/json',
    'X-Request': 'JSON',
    'X-Requested-With': 'XMLHttpRequest',
}

# 爬取过程
def craw(url):
    response = requests.get(url, params=params, headers=headers)
    print(response.json())

# 调用
craw(base_url)
```
![](https://s1.ax1x.com/2020/03/20/86YPqP.png)


### 解析响应报文，获取图片链接
解析响应报文，获取`key`，与指定url拼接作为图片链接
```py
# 定义图片基础url
img_url = 'http://hbimg.huabanimg.com/'

# 爬取过程
def craw(url):
    response = requests.get(url, params=params, headers=headers)
    # print(response.json())
    pins = response.json()['pins']
    if pins:
        for pin in pins:
            print(img_url + pin['file']['key'])

# 调用
craw(base_url)
```

![](https://s1.ax1x.com/2020/03/20/86Y0Z6.png)

### 修改为循环获取多页数据
添加循环后需要将每页的最后一条数据的`pin_id`作为参数传递到获取下一页数据的请求中。
```py
import requests

# 定义基础url
base_url = 'https://huaban.com/explore/dianyinghaibao'

# 定义图片基础url
img_url = 'http://hbimg.huabanimg.com/'

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
    'Accept': 'application/json',
    'X-Request': 'JSON',
    'X-Requested-With': 'XMLHttpRequest',
}

# 定义要获取的最大页数
pages = 5


# 爬取过程
def craw(url):
    i = 1
    # 设置起始最大id
    start_max = 2529333588

    while i <= pages:
        print('获取第 %d 页数据' % (i))
        # 定义参数
        params = {
            'k7yykous': '',
            'max': start_max,
            'limit': '20',
            'wfl': '1',
        }
        response = requests.get(url, params=params, headers=headers)
        # print(response.json())
        pins = response.json()['pins']
        if pins:
            for pin in pins:
                print(img_url + pin['file']['key'])
            # 获取最后一个pin_id作为下一次请求的参数
            start_max = pins[-1]['pin_id']

            i += 1
        else:
            print('获取响应无图片')
            break


# 调用
craw(base_url)

```

![](https://s1.ax1x.com/2020/03/20/86tufe.png)

### 下载图片

将循环中打印图片url信息语句进行修改
```py
download(pin['pin_id'], pin['file']['key'])
```

定义图片存储位置为绝对路径
```py
# 定义图片存储位置
filedir = os.path.abspath('../pictures')
```

编写下载函数<br/>
下载函数需要两个参数，`pin_id` `key`。`pin_id`与指定后缀`.jpeg`拼接作为下载文件的`文件名`；`文件名`与`图片存储位置`拼接作为图片
的本地存储路径；`key`与`img_url`图片路径拼接，作为图片下载链接<br/>
最终通过`requests`获取响应结果，使用`shutil`将图片保存到本地(需要导包)

```py
# 下载
def download(pin_id, key):
    filename = str(pin_id) + '.jpeg'
    imgpath = os.path.join(filedir, filename)
    imgurl = img_url + key
    print('开始下载 %s , url= %s ' %(filename, imgurl))
    response = requests.get(imgurl, stream=True)
    if response.status_code == 200:
        with open(imgpath, 'wb') as f:
            response.raw.deconde_content = True
            shutil.copyfileobj(response.raw, f)
```

![](https://s1.ax1x.com/2020/03/20/86UYRg.png)
![](https://s1.ax1x.com/2020/03/20/86UtzQ.png)


## 完整代码

```py
import requests
import shutil
import os

# 定义基础url
base_url = 'https://huaban.com/explore/dianyinghaibao'

# 定义图片基础url
img_url = 'http://hbimg.huabanimg.com/'

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
    'Accept': 'application/json',
    'X-Request': 'JSON',
    'X-Requested-With': 'XMLHttpRequest',
}

# 定义要获取的最大页数
pages = 5


# 爬取过程
def craw(url):
    i = 1
    # 设置起始最大id
    start_max = 2529333588

    while i <= pages:
        print('获取第 %d 页数据' % (i))
        # 定义参数
        params = {
            'k7yykous': '',
            'max': start_max,
            'limit': '20',
            'wfl': '1',
        }
        response = requests.get(url, params=params, headers=headers)
        # print(response.json())
        pins = response.json()['pins']
        if pins:
            for pin in pins:
                # print(img_url + pin['file']['key'])
                download(pin['pin_id'], pin['file']['key'])
            # 获取最后一个pin_id作为下一次请求的参数
            start_max = pins[-1]['pin_id']

            i += 1
        else:
            print('获取响应无图片')
            break

# 定义图片存储位置
filedir = os.path.abspath('./pictures/')

# 下载
def download(pin_id, key):
    filename = str(pin_id) + '.jpeg'
    imgpath = os.path.join(filedir, filename)
    imgurl = img_url + key
    print('开始下载 %s , url= %s ' %(filename, imgurl))
    response = requests.get(imgurl, stream=True)
    if response.status_code == 200:
        with open(imgpath, 'wb') as f:
            response.raw.deconde_content = True
            shutil.copyfileobj(response.raw, f)

# 调用
craw(base_url)

```

## 总结
折腾了两个小时，(‘-ωก̀ )好困，淦
