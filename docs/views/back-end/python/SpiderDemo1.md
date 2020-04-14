---
title: python爬取花瓣网图片-初探茅庐
date: 2020-03-19 22:30:39
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

## 添加要使用的包

`requests`

```shell script
pip3 install requests
```

![](https://s1.ax1x.com/2020/03/19/8yjGad.png)


`BeautifulSoup`

```shell script
pip3 install bs4
```

![](https://s1.ax1x.com/2020/03/19/8yjbJ1.png)

## 新建工程 导入相关包

```py
import requests
from bs4 import BeautifulSoup
```
导入相关包运行后提示如下图所示的ModuleNotFound错误，是由于环境配置问题导致。<br/>见[ModuleNotFound错误](./spider.html#解决modulenotfound错误)
![](https://s1.ax1x.com/2020/03/19/8yxP74.png)

## 查看网页结构，定位爬取元素位置

`右键 -> 查看网页源代码`，通过定位可以看到，要爬取的图片链接位于`class="img x layer-view loaded"`
的`a`标签下的`img`子标签，图片链接为`img`标签的`src`属性；图片的名字为`a`标签同级的`p`标签的内容

![](https://s1.ax1x.com/2020/03/19/86p2KP.png)


## 获取页面信息

定义请求头（可通过页面控制台复制）
```py
# 定义请求头
headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin: https": "//huaban.com",
    "pragma": "no-cache",
    "referer": "https//huaban.com/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
    "x-client-data": "CJG2yQEIpbbJAQjBtskBCKmdygEInqDKAQjQr8oBCLywygEIl7XKAQjttcoBCI66ygEImb3KAQjOvcoB"
}
```

定义要爬取的url
```py
# 定义url
url = 'https://huaban.com/explore/dianyinghaibao'
```

获取页面信息
```py
# 爬取过程
def craw(url):
    response = requests.get(url, headers)
    soup = BeautifulSoup(response.content, 'lxml')
    print(soup.prettify())


# 调用
craw(url)
```

执行后会获取到网页的源代码

![](https://s1.ax1x.com/2020/03/19/86AFsA.png)

:::tip 提示
如果报错如下所示，找不到'lxml'解析器的时候，通过`pip3 install lxml`安装解决
![](https://s1.ax1x.com/2020/03/19/86FVOI.png)
:::


## 获取图片链接

```py
# 获取图片链接
for pic_href in soup.find_all('a', class_='img x layer-view loaded'):
    print(pic_href)
```

通过预想的获取指定class的a标签获取图片相关信息的时候，发现并不能正确的获取到相关结果。

![](https://s1.ax1x.com/2020/03/20/86muKe.png)

经过我仔细的分析（和baidu）之后发现，图片数据不是一开始直接加载到页面中的，而是通过异步请求获取数据后渲染到页面上。
所以对花瓣网的第一次爬取失败了 :(

## ModuleNotFound错误 <Badge text="解决方案"/>

查看`Preferences -> Project -> Project Interpreter`，此时只会存在一个环境信息。

![](https://s1.ax1x.com/2020/03/19/8yzwM6.png)

点击齿轮，选择`Add Local`，弹出窗口后，选择`System Interpreter`选项，挑选合适版本的py进行引入，确认。

![](https://s1.ax1x.com/2020/03/19/8yzXQ0.png)

再次运行程序，无异常。

![](https://s1.ax1x.com/2020/03/19/86St0S.png)
