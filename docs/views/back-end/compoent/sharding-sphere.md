---
title: sharding-sphere
date: 2020-03-18 13:30:52
tags:
 - Java
 - 后端组件
 
categories:
 -  后端
---

`Apache ShardingSphere(Incubator) `是一套开源的分布式数据库中间件解决方案组成的生态圈，它由`Sharding-JDBC`、`Sharding-Proxy`和`Sharding-Sidecar（规划中）`这3款相互独立，却又能够混合部署配合使用的产品组成。它们均提供标准化的`数据分片`、`分布式事务`和`数据库治理功能`，可适用于如`Java同构`、`异构语言`、`云原生`等各种多样化的应用场景
<br>
因为系统中`产品日志管理`数据量达到了月千万级，针对此日志表进行了分表操作，此处只用到了`Sharding-JDBC`。
<br>
[官网](https://shardingsphere.apache.org/index_zh.html)

## 配置

# 分表配置

```yaml
sharding: 
  jdbc:
    datasource:
      names: 数据源名
      ds:
        type: 连接池类型
        driver-class-name: 驱动
        url: 数据库url
        username: 用户名
        password: 密码

    config:
      sharding:
        props:
          sql.show: 是否打印sql(调试可开)
        tables:
          rc_data_prod_log:         // 逻辑分表名
            actual-data-nodes: // 实际数据表 数据源.表名 可用行内表达式
            table-strategy:  #分表策略
              inline:
                shardingColumn: 分表的依据字段
                algorithm-expression: 算法
```

[Sharding-jdbc配置](https://shardingsphere.apache.org/document/current/cn/manual/sharding-jdbc/configuration/)

例子：
```yaml
# 分表配置
sharding: 
  jdbc:
    datasource:
      names: ds
      ds:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.jdbc.Driver
        url: jdbc:mysql://127.0.0.1:3306/config_management?useUnicode=true&characterEncoding=utf8&useSSL=false
        username: root
        password: root

    config:
      sharding:
        props:
          sql.show: false
        tables:
          rc_data_prod_log:
            #            key-generator-column-name: id  #主键
            #            key-generator-column-type:  UUID
            actual-data-nodes: ds.rc_data_prod_log_$->{1..12}  #数据节点
            table-strategy:  #分表策略
              inline:
                shardingColumn: month
                algorithm-expression: rc_data_prod_log_$->{month}
```

## 使用

`Sharding-Jdbc`会将一条sql按照配置到分表中都进行执行一遍后，将执行结果集进行聚合。此过程为框架自己完成，在编码过程中将多表考虑为单张表进行开发即可。

例如，针对产品日志进行月分表，在`mapper接口`中只需要声明一份，实体只需一个即可
```js
package com.tcredit.config.management.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.tcredit.config.management.dto.request.query.operation.RcDataProdLogQuery;
import com.tcredit.config.management.dto.response.operation.ProdApiDto;
import com.tcredit.config.management.dto.response.operation.ProdApiTotalDto;
import com.tcredit.config.management.entity.RcDataProdLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 日志表 Mapper 接口
 * </p>
 *
 * @author tcredit
 * @since 2019-09-27
 */

@Mapper
public interface RcDataProdLogMapper extends BaseMapper<RcDataProdLog> {

    List<ProdApiDto> selectApiList(@Param("query") RcDataProdLogQuery query);

    List<ProdApiTotalDto> selectApiTotal(@Param("query") RcDataProdLogQuery query);

}

```

假设要查询月分表中所有日志条数，编码只需要编写如`select count(*) from rc_data_prod_log`。Sharding-Jdbc会将语句自动拼接为分表可执行语句并执行，如`select count(*) from rc_data_prod_log_1`,`select count(*) from rc_data_prod_log_2`等，执行后会将结果集进行聚合，此处会将12张分表的结果集进行求和。



:::tip 说明
Sharding-Jdbc不支持`UNION` 和 `UNION ALL`，不支持`DISTINCT聚合`
:::
