---
title: druid
date: 2020-03-18 13:30:02
tags:
 - Java
 - 后端组件
 
categories:
 -  后端
---

`Druid` 是一个 `JDBC` 组件库，包含`数据库连接池`、`SQL Parser` 等组件, 被大量业务和技术产品使用或集成。

## 配置

由于引入了`sharding-sphere`，`druid`的配置作为`sharding-sphere`配置的部分引入。
<br>
见[sharding-sphere 配置](./sharding-sphere.html#配置)

## sql监控

可以通过`http://ip:port/druid`进入数据源的监控界面，查看`数据源`，`sql监控`等

![](https://s2.ax1x.com/2020/02/18/3k1U0S.png)
![](https://s2.ax1x.com/2020/02/18/3k3pct.png)
