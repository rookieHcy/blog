---
title: mybatis-plus
date: 2020-03-18 13:30:36
tags:
 - Java
 - 后端组件
 
categories:
 -  后端
---

[MyBatis-Plus](https://mp.baomidou.com/)（简称 MP）是一个 `MyBatis` 的增强工具，在 `MyBatis` 的基础上只做增强不做改变，为简化开发、提高效率而生。可以生成简单的增删改查，并方便扩展，减少xml文件的编写，降低编码难度

## 配置

mp的配置需要配合mybatis配置使用，xml配置文件需要在`mybatis`配置中指定

```yaml
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  #实体扫描，多个package用逗号或者分号分隔
  global-config:
    field-strategy: 1
    #驼峰下划线转换
    db-column-underline: true
    #刷新mapper 调试神器
    refresh-mapper: true
    #数据库大写下划线转换
    capital-mode: true
    #逻辑删除配置
    sql-injector: com.baomidou.mybatisplus.mapper.LogicSqlInjector
    logic-delete-value: 1
    logic-not-delete-value: 0


mybatis:
  configuration:
      map-underscore-to-camel-case: true
      cache-enabled: false
      call-setters-on-nulls: true
#      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath*:mapper/*.xml

#开启logging myabtis语句打印
logging:
  level:
    main.blog.mapper: trace

```

##  使用

mp框架中的实体对象、mapper层、service层有固定的写法，需要继承或实现指定的类或接口
<br>
以`产品管理`代码为例，介绍mp如何使用

### entity

`entity`需要继承`Model`类，`Model`类中实现了简单的增删改查，简单的crud操作使用此实体对象即可实现
<br>
`@TableLogic`指定逻辑删除的字段
<br>
当实体类的名称和表名称不能直接转换时，可在类上添加注解`@Table`指定，如`@TableName("batch_back_prod") `

```js
package com.tcredit.config.management.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;
import com.baomidou.mybatisplus.enums.IdType;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 数据产品管理
 * </p>
 *
 * @author tcredit
 * @since 2019-07-01
 */
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ProductManagement extends Model<ProductManagement> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    /**
     * 产品名称
     */
    private String name;
    /**
     * 产品编号
     */
    private String number;
    /**
     * 产品版本号
     */
    private String version;
    /**
     * 产品组id
     */
    private Integer groupId;
    /**
     * 产品描述
     */
    private String description;
    /**
     * 状态 1.配置中 2.使用中 3.已撤回
     */
    private Integer status;

    /**
     * 在线状态 0.离线 1.在线
     */
    private Integer online;
    /**
     * 管理员id
     */
    private Integer adminId;
    /**
     * 是否删除 1.已删除 0未删除
     */
    @TableLogic
    private Integer isDeleted;
    /**
     * 上次操作时间
     */
    private Date updateTime;
    /**
     * 创建时间
     */
    private Date createTime;

    public ProductManagement() {
    }


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    public Integer getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getNumber() {
        return this.number;
    }

    public String getVersion() {
        return this.version;
    }

    public Integer getGroupId() {
        return this.groupId;
    }

    public String getDescription() {
        return this.description;
    }

    public Integer getStatus() {
        return this.status;
    }

    public Integer getAdminId() {
        return this.adminId;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public ProductManagement setId(Integer id) {
        this.id = id;
        return this;
    }

    public ProductManagement setName(String name) {
        this.name = name;
        return this;
    }

    public ProductManagement setNumber(String number) {
        this.number = number;
        return this;
    }

    public ProductManagement setVersion(String version) {
        this.version = version;
        return this;
    }

    public ProductManagement setGroupId(Integer groupId) {
        this.groupId = groupId;
        return this;
    }

    public ProductManagement setDescription(String description) {
        this.description = description;
        return this;
    }

    public ProductManagement setStatus(Integer status) {
        this.status = status;
        return this;
    }

    public ProductManagement setAdminId(Integer adminId) {
        this.adminId = adminId;
        return this;
    }

    public ProductManagement setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
        return this;
    }

    public ProductManagement setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
        return this;
    }

    public ProductManagement setCreateTime(Date createTime) {
        this.createTime = createTime;
        return this;
    }

    public String toString() {
        return "ProductManagement(id=" + this.getId() + ", name=" + this.getName() + ", number=" + this.getNumber() + ", version=" + this.getVersion() + ", groupId=" + this.getGroupId() + ", description=" + this.getDescription() + ", status=" + this.getStatus() + ", adminId=" + this.getAdminId() + ", isDeleted=" + this.getIsDeleted() + ", updateTime=" + this.getUpdateTime() + ", createTime=" + this.getCreateTime() + ")";
    }

    public Integer getOnline() {
        return online;
    }

    public void setOnline(Integer online) {
        this.online = online;
    }
}

```

### mapper

`mapper接口`需要配合`xml文件`使用。
<br>
在`mapper接口`中需要继承`BaseMapper`类，此类中含有比`Model`更多功能的增删改查、批量操作等
<br>
mp框架中不能直接实现的复杂查询还需要通过编写`xml文件`完成，与`mybatis`使用方式一致，如下面代码中的`selectEnableProd()`

```js
package com.tcredit.config.management.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.tcredit.config.management.entity.ProductManagement;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 数据产品管理 Mapper 接口
 * </p>
 *
 * @author tcredit
 * @since 2019-07-01
 */
public interface ProductManagementMapper extends BaseMapper<ProductManagement> {
    
    List<Integer> selectEnableProd(@Param("prodId") Integer prodId);
    
}
```

xml文件：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.tcredit.config.management.mapper.ProductManagementMapper">


    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.tcredit.config.management.entity.ProductManagement">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="number" property="number"/>
        <result column="version" property="version"/>
        <result column="group_id" property="groupId"/>
        <result column="description" property="description"/>
        <result column="status" property="status"/>
        <result column="admin_id" property="adminId"/>
        <result column="is_deleted" property="isDeleted"/>
        <result column="update_time" property="updateTime"/>
        <result column="create_time" property="createTime"/>
    </resultMap>

    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        id, name, number, version, group_id, description, status, admin_id, is_deleted, update_time, create_time
    </sql>

    <select id="selectEnableProd" resultType="integer">
        SELECT
          id
        from product_management t1
        where is_deleted = 0
          and status = 2
          and t1.id != #{prodId}
          and exists (
          select 1 from product_management t2 where t2.id=#{prodId} and t2.number=t1.number
          )
    </select>

</mapper>
```

### service

业务接口需要继承`IService接口`，其他使用与普通接口相同

```js
package com.tcredit.config.management.service.platform;

import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.IService;
import com.tcredit.config.management.common.enums.Enum;
import com.tcredit.config.management.dto.request.query.platform.ProductManagementQuery;
import com.tcredit.config.management.entity.ProductManagement;

import java.util.List;


/**
 * <p>
 * 数据产品管理 业务类接口
 * </p>
 *
 * @author tcredit
 * @since 2019-06-26
 */
public interface ProductManagementService extends IService<ProductManagement> {
  
    // 产品编码是否存在
    boolean isNumberExists(String number);

    // 产品名称、版本号是否存在
    boolean isNameAndVersionExists(int id, String name, String version);

    // 插入
    Integer insertOne(ProductManagement productManagement);

    // 分页查询
    Page<ProductManagement> query(ProductManagementQuery query, Enum.IsDeleted isDeleted);

    // 根据分组编号查找组下产品个数
    int countByProdGroupId(Integer id);

    // 查询同产品编码是否有发布的产品
    List<Integer> selectEnableProd(Integer prodId);

    // 产品否有相同版本号
    boolean isNumberAndVersionExists(String number, String versionNew);

    // 状态查询
    List<ProductManagement> selectByStatus(int type);

    // 查询total
    Integer selectTotal(ProductManagementQuery query, Enum.IsDeleted isDeleted);

    // 根据产品编码查找已发布状态的产品
    ProductManagement getPublishedByProdCode(String prodCode);

    // 根据产品编码、版本号查询产品
    ProductManagement getByProdCodeAndVersion(String prodCode, String prodVersion);

    // 产品否有相同版本号 排除指定产品
    boolean isNumberAndVersionExists(int id, String number, String version);

    // 查询在线状态的产品
    List<ProductManagement> selectByOnline( int online);

    // 逻辑删除
    boolean deleteLogic(ProductManagement productManagement);

    // 查找逻辑删除的产品
    ProductManagement selectDeletedById(Integer prodId);
}

```

`业务类`中有固定的写法，继承`ServiceImpl<Mapper接口, 实体对象>`并实现`业务接口`
```js
public class ProductManagementServiceImpl extends ServiceImpl<ProductManagementMapper, ProductManagement> implements ProductManagementService {

}
```

`业务类`中可以通过条件构造器`Wrapper`实现不是特别复杂的数据库操作，参考官方文档[条件构造器](https://mp.baomidou.com/guide/wrapper.html#abstractwrapper)

完整示例代码如下：
```js
package com.tcredit.config.management.service.impl.platform;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.tcredit.config.management.common.enums.Enum;
import com.tcredit.config.management.dto.request.query.platform.ProductManagementQuery;
import com.tcredit.config.management.entity.ProductManagement;
import com.tcredit.config.management.mapper.ProductManagementMapper;
import com.tcredit.config.management.service.platform.ProductManagementService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 数据产品管理 业务实现类
 * </p>
 *
 * @author tcredit
 * @since 2019-06-26
 */
@Service
public class ProductManagementServiceImpl extends ServiceImpl<ProductManagementMapper, ProductManagement> implements ProductManagementService {

    @Override
    public boolean isNumberExists(String number) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("number", number);
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());


        return this.baseMapper.selectCount(wrapper) > 0;
    }

    @Override
    public boolean isNameAndVersionExists(int id, String name, String version) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("name", name);
        wrapper.eq("version", version);
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());
        if (id > 0) wrapper.notIn("id", id);

        return this.baseMapper.selectCount(wrapper) > 0;
    }

    @Override
    public boolean isNumberAndVersionExists(int id, String number, String version) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("number", number);
        wrapper.eq("version", version);
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());
        if (id > 0) wrapper.notIn("id", id);

        return this.baseMapper.selectCount(wrapper) > 0;
    }

    @Override
    public List<ProductManagement> selectByOnline(int online) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());
        wrapper.eq("online", online);

        return this.baseMapper.selectList(wrapper);
    }

    @Override
    public boolean deleteLogic(ProductManagement productManagement) {
        return this.baseMapper.updateById(productManagement) > 0;
    }

    @Override
    public ProductManagement selectDeletedById(Integer prodId) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("id", prodId);
        wrapper.eq("is_deleted", Enum.IsDeleted.TRUE.getStatus());
       return this.selectOne(wrapper);
    }

    @Override
    public Integer insertOne(ProductManagement productManagement) {
        return this.baseMapper.insert(productManagement);
    }

    @Override
    public Page<ProductManagement> query(ProductManagementQuery query, Enum.IsDeleted isDeleted) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("is_deleted", isDeleted.status);
        if (query.getName() != null) wrapper.like("name", query.getName());
        if (query.getNumber() != null) wrapper.like("number", query.getNumber());
        if (query.getGroupId() != null) wrapper.eq("group_id", query.getGroupId());
        if (query.getStatus() != null) wrapper.eq("status", query.getStatus());
        if (query.getOnline() != null) {
            wrapper.eq("online", query.getOnline());
            wrapper.notIn("status", Enum.Status.CONFIGING.type);
        }

        Page<ProductManagement> queryPage = new Page<>(query.getPage(), query.getLimit(), query.getOrderByField(), query.isAsc());
        return this.selectPage(queryPage, wrapper);
    }

    @Override
    public Integer selectTotal(ProductManagementQuery query, Enum.IsDeleted isDeleted) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("is_deleted", isDeleted.status);
        if (query.getName() != null) wrapper.like("name", query.getName());
        if (query.getNumber() != null) wrapper.like("number", query.getNumber());
        if (query.getGroupId() != null) wrapper.eq("group_id", query.getGroupId());
        if (query.getStatus() != null) wrapper.eq("status", query.getStatus());
        if (query.getOnline() != null) {
            wrapper.eq("online", query.getOnline());
            wrapper.notIn("status", Enum.Status.CONFIGING.type);
        }
        return this.selectCount(wrapper);
    }

    @Override
    public int countByProdGroupId(Integer id) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("group_id", id);

        return this.baseMapper.selectCount(wrapper);
    }

    @Override
    public List<Integer> selectEnableProd(Integer prodId) {
        return this.baseMapper.selectEnableProd(prodId);
    }

    @Override
    public boolean isNumberAndVersionExists(String number, String version) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("number", number);
        wrapper.eq("version", version);
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());

        return this.baseMapper.selectCount(wrapper) > 0;
    }

    @Override
    public List<ProductManagement> selectByStatus(int status) {
        Wrapper<ProductManagement> wrapper = new EntityWrapper<>();
        wrapper.eq("status", status);
        wrapper.eq("is_deleted", Enum.IsDeleted.FALSE.getStatus());

        return this.baseMapper.selectList(wrapper);
    }

```

## 代码生成

`entity`、`mapper`、`xml文件`、`业务接口`、`业务类`均可以通过代码自动生成，要自动生成代码的表需要提前创建好。

### 依赖包
```xml
  <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatisplus-spring-boot-starter</artifactId>
            <version>${mybatisplus.spring.boot.version}</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus</artifactId>
            <version>${mybatisplus.version}</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>3.1.2</version>
            <exclusions>
                <exclusion>
                    <artifactId>mybatis-spring</artifactId>
                    <groupId>org.mybatis</groupId>
                </exclusion>
                <exclusion>
                    <artifactId>mybatis-plus-core</artifactId>
                    <groupId>com.baomidou</groupId>
                </exclusion>
            </exclusions>

        </dependency>
        <!-- MP  代码生成工具需要的依赖1 velocity-engine-core 2 slf4j-api   3slf4j-log4j12 -->
        <!-- Apache velocity -->
        <dependency>
            <groupId>org.apache.velocity</groupId>
            <artifactId>velocity-engine-core</artifactId>
            <version>2.0</version>
            <exclusions>
                <exclusion>
                    <artifactId>commons-lang3</artifactId>
                    <groupId>org.apache.commons</groupId>
                </exclusion>
                <exclusion>
                    <artifactId>slf4j-api</artifactId>
                    <groupId>org.slf4j</groupId>
                </exclusion>
            </exclusions>
        </dependency>
```

### 完整代码
```js
package com.tcredit.config.management.codeGenerator;

import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

import java.sql.SQLException;

public class MyBatisPlusGenerator {

    public static void main(String[] args) throws SQLException {

        //1. 全局配置
        GlobalConfig config = new GlobalConfig();
        config.setActiveRecord(true) // 是否支持AR模式
                .setAuthor("tcredit") // 作者
                .setOutputDir("/Users/houchunyu/git/config-base/config-management/src/test") // 生成路径
                .setFileOverride(true)  // 文件覆盖
                .setIdType(IdType.AUTO) // 主键策略
                .setServiceName("%sService")  // 设置生成的service接口的名字的首字母是否为I
                .setBaseResultMap(true)//生成基本的resultMap
                .setBaseColumnList(true) //生成基本的SQL片段
        ;

        //2. 数据源配置
        DataSourceConfig dsConfig = new DataSourceConfig();
        dsConfig.setDbType(DbType.MYSQL)  // 设置数据库类型
                .setDriverName("com.mysql.jdbc.Driver")
                .setUrl("jdbc:mysql://localhost:3306/config_management?useSSL=false")
                .setUsername("root")
                .setPassword("root");

        //3. 策略配置globalConfiguration中
        StrategyConfig stConfig = new StrategyConfig();
        stConfig.setCapitalMode(true) //全局大写命名
                .setNaming(NamingStrategy.underline_to_camel).setEntityLombokModel(true);// 数据库表映射到实体的命名策略
        //.setTablePrefix("tbl_")
        //.setInclude("employee");  // 生成的表

        //4. 包名策略配置
        PackageConfig pkConfig = new PackageConfig();
        pkConfig.setParent("com.tcredit.config.management")
                .setMapper("mapper")//dao
                .setService("facade")//servcie
                .setController("controller")//controller
                .setEntity("entity")
                .setXml("mapper.xml");//mapper.xml

        //5. 整合配置
        AutoGenerator ag = new AutoGenerator();
        ag.setGlobalConfig(config)
                .setDataSource(dsConfig)
                .setStrategy(stConfig)
                .setPackageInfo(pkConfig);

        //6. 执行
        ag.execute();
    }

}
```
