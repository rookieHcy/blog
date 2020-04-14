---
title: python爬取网站验证码
date: 2020-03-26 10:22:46
tags:
 - Python
 - 爬虫
categories:
 -  后端
---

## 源码
```python 
import requests
import time
import threading

def loop(num):
    print('thread %s is running...' % threading.current_thread().name)
    n = 0
    # 循环一百次
    while n < 100:
        n = n + 1
        print('thread %s >>> %s' % (threading.current_thread().name, n))
        try:
            timeStr = str(time.time())
            # 网址隐藏
            url = 'https://www.xxxxx.com/captcha/image?t=' + timeStr
            # 构造请求头
            headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36'
            }
            # 发送请求
            res = requests.get(url, headers=headers)
            # 把获取的二进制写成图片
            with open('result//' + num+'_' + str(n) + '.jpg', 'wb') as f:
                f.write(res.content)
            # 避免高速轮循
            time.sleep(1)
        except Exception as e:
            print(e)
    print('thread %s ended.' % threading.current_thread().name)

# 开启五个线程
for i in range(5):
    t = threading.Thread(target=loop, name='LoopThread-' + str(i), args=str(i))
    t.start()

```

## 爬取结果

![](https://s1.ax1x.com/2020/03/26/8z8IOS.png)
