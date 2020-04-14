---
title: 300行代码手写Spring核心思想 - 1
date: 2020-03-28 12:13:25
tags:
 - Java
 - Spring
categories:
 -  后端
---

:::tip 系列文章
+ [300行代码手写Spring核心思想 - 1](./HandWriteSpring_1.html)
+ [300行代码手写Spring核心思想 - 2](./HandWriteSpring_2.html)
:::

<!-- more -->


::: warning
参考腾讯课堂鼓泡学院课程编写
:::

## 基本思路

Spring的基本思路可以精简为三个阶段，配置阶段、初始化阶段和运行阶段。

![](https://s1.ax1x.com/2020/03/28/GAukyq.png)

### 配置阶段

+ 配置`web.xml` 配置`DispatchServlet`继承`HttpServlet`，含有三个重要方法:`init()`、`service()`、`destroy（）`
+ 配置`init-param` 初始化参数
+ 配置`url-pattern`配置加载配置文件路径 
+ 配置`Annotation`注解
    
### 初始化阶段

+ 调用`init()`方法
+ IOC容器初始化
+ 扫描相关的类
+ 通过`反射`创建实例并保存到`ioc容器`中
+ 进行`DI`操作： 扫描`IOC容器`中的实例，给没有赋值的属性自动赋值
+ 初始化`HandlerMapping`，将`url`和`method`的映射关系进行保存

### 运行阶段

+ 调用`doGet()/doPost(0方法`，获取`request/response`对象
+ 匹配`handlerMapping`，从`request`对象中获的用户输入的`url`，找到其对应的`Method` 
+ 反射调用方法，并返回结果
+ 将结果通过`response.getWrite().write()`写出到浏览器

## 实现过程

### 准备工作

新建`maven`项目，勾选使用模板创建
![](https://s1.ax1x.com/2020/03/28/GA3Y7t.png)

构建好后删除`webapp`下的`index.jsp`并创建相关包或文件夹
![](https://s1.ax1x.com/2020/03/28/GANqUA.png)

引入相关jar包和组件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.houcy7.spring</groupId>
    <artifactId>houcy7-spring</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- dependency versions -->
        <servlet.api.version>2.4</servlet.api.version>
    </properties>


    <dependencies>

        <!-- requied start -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>${servlet.api.version}</version>
            <scope>provided</scope>
        </dependency>
        <!-- requied end -->

    </dependencies>

    <build>
        <finalName>${artifactId}</finalName>
        <resources>
            <resource>
                <directory>${basedir}/src/main/resources</directory>
                <includes>
                    <include>**/*</include>
                </includes>
            </resource>
            <resource>
                <directory>${basedir}/src/main/java</directory>
                <excludes>
                    <exclude>**/*.java</exclude>
                    <exclude>**/*.class</exclude>
                </excludes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.3.2</version>
                <configuration>
                    <source>1.6</source>
                    <target>1.6</target>
                    <encoding>UTF-8</encoding>
                    <compilerArguments>
                        <verbose />
                        <bootclasspath>${java.home}/lib/rt.jar</bootclasspath>
                    </compilerArguments>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.mortbay.jetty</groupId>
                <artifactId>jetty-maven-plugin</artifactId>
                <version>8.1.16.v20140903</version>
                <configuration>
                    <stopKey>stop</stopKey>
                    <stopPort>8399</stopPort>
                    <scanIntervalSeconds>0</scanIntervalSeconds>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```


## 配置阶段

### 编写web.xml

+ 添加`servlet`定义配置`DispatcherServlet`：前端处理器控制器，接受HTTP请求和转发请求的类，是分发`Controller`请求的，是Spring的核心要素。
+ 指定`Spring IOC容器`需要读取的定义了非web层的Bean（DAO/Service）的XML文件路径。可以指定多个XML文件路径，可以用逗号、冒号等来分隔。如果没有指定”contextConfigLocation”参数，则会在 /WEB-INF/下查找
+ 和上边的`servlet`中配置的`servlet-name`对应

:::tip 
此处为了方便`contextConfigLocation`配置使用了properties类型的文件
:::

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:javaee="http://java.sun.com/xml/ns/javaee"
         xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
         xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
         version="2.4">
    <display-name>Gupao Web Application</display-name>
    <servlet>
        <!--    添加servlet定义配置DispatcherServlet：前端处理器控制器，接受HTTP请求和转发请求的类，是分发Controller请求的，是Spring的核心要素。-->
        <servlet-name>gpmvc</servlet-name>
        <servlet-class>com.houcy7.framework.servlet.GPDispatcherServlet</servlet-class>
        <!--
        指定Spring IOC容器需要读取的定义了非web层的Bean（DAO/Service）的XML文件路径。
        可以指定多个XML文件路径，可以用逗号、冒号等来分隔。如果没有指定”contextConfigLocation”参数，则会在 /WEB-INF/下查找
         此处为了方便使用了properties类型的文件
         -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>application.properties</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--  和上边的servlet中的servlet-name对应-->
    <servlet-mapping>
        <servlet-name>gpmvc</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>

```

### 创建相应类或文件

+ 创建`GPDispatcherServlet`

```java
package com.houcy7.framework.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GPDispatcherServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
```

+ 在`resources`下创建`application.properties`并指定包扫描路径`com.houcy7.demo`

```properties
scanPackage=com.houcy7.demo
```

## 定义注解

这里只定义了几个常见注解。

`GPAutowired`
```java
package com.houcy7.framework.annotation;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GPAutowired {
    String value() default "";
}

```

`GPController`
```java
package com.houcy7.framework.annotation;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GPController {
    String value() default "";
}
```

`GPRequestMapping`
```java
package com.houcy7.framework.annotation;

import java.lang.annotation.*;

@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GPRequestMapping {
    String value() default "";
}
```

`GPRequestParam`
```java
package com.houcy7.framework.annotation;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GPRequestParam {
    String value() default "";
}
```

`GPService`
```java
package com.houcy7.framework.annotation;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface GPService {
    String value() default "";
}
```

## 初始化阶段

### 重写`init()`

```java
@Override
public void init(ServletConfig config) throws ServletException {
    //模板模式
    //1、加载配置文件
    doLoadConfig();
    //2、扫描相关的类
    doScanner();
    //3、初始化所有相关的类的实例，并且放入到IOC容器之中
    doInstance();
    //4、完成依赖注入
    doAutowired();
    //5、初始化HandlerMapping
    initHandlerMapping();

    System.out.println("GP Spring framework is init.");
}
```
### 加载配置文件

+ 定义`contextConfigLocation`常量
```java
private static final String CONTEXT_CONFIG_LOCATION = "contextConfigLocation";
```

+ 修改获取配置文件方法
```java
doLoadConfig(config.getInitParameter(CONTEXT_CONFIG_LOCATION));
```

+ 声明变量存储`aplication.properties`的配置内容
```java
//存储aplication.properties的配置内容
private Properties contextConfig = new Properties();
```

+ 实现方法
```java
private void doLoadConfig(String contextConfigLocation) {
        InputStream inputStream = null;
    try {
        inputStream = this.getClass().getResourceAsStream(contextConfigLocation);
        contextConfig.load(inputStream);
    } catch (Exception e){
       e.printStackTrace();
    } finally {
        if(null != inputStream){
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```
### 扫描相关的类

+ 定义`contextConfigLocation`常量

```java
private static final String SCAN_PACKAGE = "scanPackage";
```

+ 修改对应方法
```java
doScanner(contextConfig.getProperty(SCAN_PACKAGE));
```

+ 声明`classNames`存储所有扫描到的类

```java
//存储所有扫描到的类
private List<String> classNames = new ArrayList<String>();
```

+ 实现方法

```java
private void doScanner(String scanPackage) {
    // 将配置的路径 com.houcy7.demo 转换为 /com/houcy7/demo
    String baseUrl = "/" + scanPackage.replaceAll("\\.", "/");
    // 获取绝对路径
    URL url = this.getClass().getClassLoader().getResource(baseUrl);

    // 获取文件
    if(null == url || null == url.getFile()) return;
    File classPath = new File(url.getFile());
    for (File file : classPath.listFiles()) {
        if(file.isDirectory()){
            doScanner(scanPackage + "." + file.getName());
        } else {
            // 如果后缀名不为 .class 的跳过
            if(!file.getName().endsWith(".class")) continue;
            // 拼接类名进行保存
            String className = scanPackage + "." + file.getName().replace(".class", "");
            classNames.add(className);
        }
    }
}
```

### 初始化相关类

+ 定义`IOC容器`

```java
//IOC容器，保存所有实例化对象
//注册式单例模式
private Map<String,Object> ioc = new HashMap<String,Object>();
```

+ 实现方法
```java
private void doInstance() {
    // 如果一个扫描到的类都没有 直接返回
    if (classNames.isEmpty()) return;
    try {
        for (String className : classNames) {
            // 加载类
            Class<?> clazz = Class.forName(className);
            
            //判断注解
            if(clazz.isAnnotationPresent(GPController.class)){
                Object instance = clazz.newInstance();
                // 类名称首字母转小写
                String beanName = toLowerFirstCase(clazz.getSimpleName());
                ioc.put(beanName, instance);
            } else if(clazz.isAnnotationPresent(GPService.class)){
                //1、默认的类名首字母小写
                String beanName = toLowerFirstCase(clazz.getSimpleName());
                
                //2、自定义命名
                GPService service = clazz.getAnnotation(GPService.class);
                if(!"".equals(service.value())){
                    beanName = service.value();
                }
                Object instance = clazz.newInstance();
                ioc.put(beanName, instance);
                
                //3、根据类型注入实现类，投机取巧的方式
                for (Class<?> i : clazz.getInterfaces()) {
                    if(ioc.containsKey(i.getName())){
                        throw new Exception("The beanName is exists!!");
                    }
                    ioc.put(i.getName(),instance);
                }
            }

        }
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    } catch (IllegalAccessException e) {
        e.printStackTrace();
    } catch (InstantiationException e) {
        e.printStackTrace();
    } catch (Exception e) {
        e.printStackTrace();
    }
}

private String toLowerFirstCase(String simpleName) {
    char [] chars = simpleName.toCharArray();
    chars[0] += 32;
    return  String.valueOf(chars);
}
```
### 完成依赖注入

```java
private void doAutowired() {
    // 如果容器中没有bean的时候 直接返回
    if(ioc.isEmpty()) return;
    for (Map.Entry<String, Object> entry : ioc.entrySet()) {
        // 获取实例对象的所有属性
        Field[] fields = entry.getValue().getClass().getDeclaredFields();
        // 遍历所有属性 对含有 GPAutowired 注解的属性 进行注入
        for(Field field : fields){
            if(!field.isAnnotationPresent(GPAutowired.class)){ continue; }
            GPAutowired annotation = field.getAnnotation(GPAutowired.class);
            // 判断注入的时候有没有指定名字 没有指定名字 为类名称
            String beanName = "".equals(annotation.value().trim()) ? field.getType().getName() : annotation.value().trim();
            // 开启访问
            field.setAccessible(true);
            // 执行注入！！！
            try {
                field.set(entry.getValue(), ioc.get(beanName));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
    }
}
```
### 初始化HandlerMapping

+ 声明`handlerMapping`
```java
//保存Controller中所有Mapping的对应关系
private Map<String, Method> handlerMapping = new HashMap<String,Method>();
```

+ 方法实现
```java
private void initHandlerMapping() {
    // 如果ioc容器为空的话 直接返回
    if(ioc.isEmpty()) return;
    for (Map.Entry<String, Object> entry : ioc.entrySet()) {
        Class<?> clazz = entry.getValue().getClass();
        if(!clazz.isAnnotationPresent(GPController.class)) continue;

        String baseUrl = "";
        // 获取Controller的url配置
        if(clazz.isAnnotationPresent(GPRequestMapping.class)){
            GPRequestMapping requestMapping = clazz.getAnnotation(GPRequestMapping.class);
            baseUrl = requestMapping.value();
        }

        // 获取method的配置
        Method[] methods = clazz.getMethods();
        for (Method method : methods) {
            //没有加RequestMapping注解的直接忽略
            if(!method.isAnnotationPresent(GPRequestMapping.class)){ continue; }

            //映射URL
            GPRequestMapping requestMapping = method.getAnnotation(GPRequestMapping.class);
            //  /demo/query
            //  (//demo//query)

            // 拼接的时候 为了避免出现多个 "//" 使用正则进行替换
            String url = ("/" + baseUrl + "/" + requestMapping.value()).replaceAll("/+", "/");
            handlerMapping.put(url,method);
            System.out.println("Mapped " + url + "," + method);
        }

    }
}
```

## 启动项目

编写测试类，启动控制台输出如下
![](https://s1.ax1x.com/2020/03/29/GEn9Xt.png)

## 调用阶段

### 重写`doGet()` `doPost()`

重写`doGet()` `doPost()`，当服务器抛出异常的时候，返回状态码500

```java
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    this.doPost(req,resp);
}

@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    //派遣，分发任务
    try {
        //委派模式
        doDispatch(req,resp);
    } catch (Exception e) {
        e.printStackTrace();
        resp.getWriter().write("500 Excetion Detail:" +Arrays.toString(e.getStackTrace()));
    }
}
```

### 编写`doDispatch()`

+ 获取请求的`url`
+ 判断`url`是否存在`handlerMapping`映射中，不存在返回`404`
+ 获取请求中携带的实参列表
+ 获取调用方法的形参列表
+ 通过循环 对参数进行赋值。此处只是进行模拟，将参数匹配写死
+ 通过获取的方法名，反射获取到类，通过反射执行方法并返回结果

```java
private void doDispatch(HttpServletRequest req, HttpServletResponse resp) throws IOException, InvocationTargetException, IllegalAccessException {
    // 获取请求url 没有找到返回404状态码
    String url = req.getRequestURI();
    String contextPath = req.getContextPath();
    url = url.replaceAll(contextPath, "").replaceAll("/+", "/");
    if (!this.handlerMapping.containsKey(url)) {
        resp.getWriter().write("404 Not Found!!");
        return;
    }

    // 从handlerMapper中获取方法
    Method method = this.handlerMapping.get(url);
    // 请求中携带的实参
    Map<String, String[]> params = req.getParameterMap();
    // 方法上的形参
    Class<?>[] parameterTypes = method.getParameterTypes();
    //保存请求的url参数列表
    Map<String, String[]> parameterMap = req.getParameterMap();
    //保存赋值参数的位置
    Object[] paramValues = new Object[parameterTypes.length];
    //按根据参数位置动态赋值
    for (int i = 0; i < parameterTypes.length; i++) {
        Class parameterType = parameterTypes[i];
        if (parameterType == HttpServletRequest.class) {
            paramValues[i] = req;
        } else if (parameterType == HttpServletResponse.class) {
            paramValues[i] = resp;
        } else if (parameterType == String.class) {

            //提取方法中加了注解的参数
            Annotation[][] pa = method.getParameterAnnotations();
            for (int j = 0; j < pa.length; j++) {
                for (Annotation a : pa[i]) {
                    if (a instanceof GPRequestParam) {
                        String paramName = ((GPRequestParam) a).value();
                        if (!"".equals(paramName.trim())) {
                            String value = Arrays.toString(parameterMap.get(paramName))
                                    .replaceAll("\\[|\\]", "")
                                    .replaceAll("\\s", ",");
                            paramValues[i] = value;
                        }
                    }
                }
            }
        }
    }
    //投机取巧的方式
    //通过反射拿到method所在class，拿到class之后还是拿到class的名称
    //再调用toLowerFirstCase获得beanName
   if(null == params || params.isEmpty() || null == params.get("name")[0]){
        method.invoke(ioc.get(beanName), req,resp);
    } else {
        method.invoke(ioc.get(beanName), req,resp,params.get("name")[0]);
    }
}
```

### 执行截图

`url: /time`
![](https://s1.ax1x.com/2020/03/29/GEMo4O.png)

`url: /name`
![](https://s1.ax1x.com/2020/03/29/GEMbgH.png)

`url: /name?name=houcy7`
![](https://s1.ax1x.com/2020/03/29/GEMqvd.png)

`url: /notfound`    
![](https://s1.ax1x.com/2020/03/29/GEMXDI.png)

:::danger 问题
本版本中存在的问题，会在v2版本中进行优化
+ 不能对参数进行动态解析
+ 参数中必须含有`request`和`response`
+ 存在着中文乱码
+ 不能对url进行正则匹配
:::


:::tip
拜了个拜 2020年03月29日01:20:11
:::
