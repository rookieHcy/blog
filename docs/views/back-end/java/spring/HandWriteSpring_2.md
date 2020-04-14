---
title: 300行代码手写Spring核心思想 - 2
date: 2020-03-28 16:00:47
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

## V1版本中存在的问题
+ 不能对参数进行动态解析
+ 参数中必须含有`request`和`response`
+ 存在着中文乱码
+ 不能对url进行正则匹配

## 解决不能对参数进行动态解析

### 修改存储handlerMapping的属性

+ 复制一份`GPDispatcherServlet`，并重新命名，在`web.xml`中进行修改

+ 新建属性
```java
//保存所有的Url和方法的映射关系
private List<Handler> handlerMapping = new ArrayList<Handler>();
```


+ 新建内部类`Handler`，提供带参构造函数，构造时保存加注释参数和`response``request`的位置

```java
 private class Handler {
    private Object controller;
    private Method method;
    private String url;
    private Map<String, Integer> paramIndexMapping;

    public Handler(Object controller, Method method, String url) {
        this.controller = controller;
        this.method = method;
        this.url = url;

        this.paramIndexMapping = new HashMap<>();
        initParamIndexMapping(this.method);
    }

    private void initParamIndexMapping(Method method) {
        // 此处为二维数组 一个方法可能有多个参数 一个参数可能有多个注解
        Annotation[][] annotations = method.getParameterAnnotations();
        // 通过遍历二维数组 获取加了注解的参数
        for (int i = 0; i < annotations.length; i++) {
            for (Annotation annotation : annotations[i]) {
                if (annotation instanceof GPRequestParam) {
                    String paramName = ((GPRequestParam) annotation).value();
                    if (!"".equals(paramName.trim())) {
                        paramIndexMapping.put(paramName, i);
                    }
                }
            }
        }

        // 获取参数中 response或request的参数
        Class<?>[] parameterTypes = method.getParameterTypes();
        for (int i = 0; i < parameterTypes.length; i++) {
            Class<?> parameterType = parameterTypes[i];
            if (parameterType == HttpServletRequest.class || parameterType == HttpServletResponse.class) {
                paramIndexMapping.put(parameterType.getName(), i);
            }
        }

    }

    public Object getController() {
        return controller;
    }

    public void setController(Object controller) {
        this.controller = controller;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Map<String, Integer> getParamIndexMapping() {
        return paramIndexMapping;
    }

    public void setParamIndexMapping(Map<String, Integer> paramIndexMapping) {
        this.paramIndexMapping = paramIndexMapping;
    }
}
```

### 修改`initHandlerMapping`（赋值）
```java
handlerMapping.add(new Handler(entry.getValue(), method, url));
```

### 修改`doDispatch`（读取）

+ 添加循环获取`handler`方法
```java
private Handler getHandler(HttpServletRequest req) {
    if (handlerMapping.isEmpty()) return null;

    String url = req.getRequestURI();
    String contextPath = req.getContextPath();
    url = url.replace(contextPath, "").replaceAll("/+", "/");

    for (Handler handler : handlerMapping) {
        try {
            if (handler.getUrl().equals(url))
                return handler;
        } catch (Exception e) {
            throw e;
        }
    }
    return null;
}
```

+ 修改`doDispatcher`

```java
 private void doDispatch(HttpServletRequest req, HttpServletResponse resp) throws Exception {
    Handler handler = getHandler(req);
    if(null == handler){
        resp.getWriter().write("404 not found");
        return;
    }

    //获取方法的参数列表
    Class<?> [] paramTypes = handler.method.getParameterTypes();

    //保存所有需要自动赋值的参数值
    Object [] paramValues = new Object[paramTypes.length];

    Map<String, String[]> params = req.getParameterMap();
    for (Map.Entry<String, String[]> param : params.entrySet()) {
        String value = Arrays.toString(param.getValue()).replaceAll("\\[|\\]", "").replaceAll(",\\s", ",");

        //如果找到匹配的对象，则开始填充参数值
        if(!handler.paramIndexMapping.containsKey(param.getKey())){continue;}
        int index = handler.paramIndexMapping.get(param.getKey());
        paramValues[index] = convert(paramTypes[index],value);
    }

    //设置方法中的request和response对象
     if (handler.paramIndexMapping.containsKey(HttpServletRequest.class.getName())) {
         int reqIndex = handler.paramIndexMapping.get(HttpServletRequest.class.getName());
         paramValues[reqIndex] = req;
     }

     if (handler.paramIndexMapping.containsKey(HttpServletResponse.class.getName())) {
         int respIndex = handler.paramIndexMapping.get(HttpServletResponse.class.getName());
         paramValues[respIndex] = resp;
     }

    handler.method.invoke(handler.controller, paramValues);
}
```

+ `convert`
```java
//url传过来的参数都是String类型的，HTTP是基于字符串协议
//只需要把String转换为任意类型就好
private Object convert(Class<?> type,String value){
    if(Integer.class == type){
        return Integer.valueOf(value);
    } else if(Double.class == type){
        return Double.valueOf(value);
    } 
    //如果还有double或者其他类型，继续加if
    return value;
}
```

### 运行截图

此时程序可以正常执行
![](https://s1.ax1x.com/2020/03/29/GVIXRI.png)

## 解决参数中必须含有`request`和`response`

在doDispatcher中直接进行返回
```java
Object invoke = handler.method.invoke(handler.controller, paramValues);
resp.getWriter().write(invoke.toString());
```

controller
```java
@GPRequestMapping("/plus")
public String plus( @GPRequestParam("a") Integer a,  @GPRequestParam("b") Integer b) throws IOException {
   return demoService.plus(a, b);
}
```

service
```java
@Override
public String plus(Integer a, Integer b) {
    return String.format("%d + %d = %d", a , b, a + b);
}
```

执行结果
![](https://s1.ax1x.com/2020/03/29/GVTb8A.png)

## 解决返回中文乱码问题

原运行截图
!()[https://s1.ax1x.com/2020/03/29/GV7lx1.png]

在写出到浏览器时添加编码`GBK``
```java
Object invoke = handler.method.invoke(handler.controller, paramValues);
resp.setCharacterEncoding("gbk");
resp.getWriter().write(invoke.toString());
``` 

运行截图
![](https://s1.ax1x.com/2020/03/29/GV7rsP.png)

## 解决url不能匹配正则

有需求会用到url正则匹配。
如`/edit/*`可以匹配到`/edit/1` `/edit/2` `/edit/2`等等

### 修改内部类`Handler`

把字符串类型的url修改为正则

```java
private class Handler {
    private Object controller;
    private Method method;
    private Pattern url;
    private Map<String, Integer> paramIndexMapping;

    public Handler(Object controller, Method method, Pattern url) {
        this.controller = controller;
        this.method = method;
        this.url = url;

        this.paramIndexMapping = new HashMap<>();
        initParamIndexMapping(this.method);
    }

    private void initParamIndexMapping(Method method) {
        // 此处为二维数组 一个方法可能有多个参数 一个参数可能有多个注解
        Annotation[][] annotations = method.getParameterAnnotations();
        // 通过遍历二维数组 获取加了注解的参数
        for (int i = 0; i < annotations.length; i++) {
            for (Annotation annotation : annotations[i]) {
                if (annotation instanceof GPRequestParam) {
                    String paramName = ((GPRequestParam) annotation).value();
                    if (!"".equals(paramName.trim())) {
                        paramIndexMapping.put(paramName, i);
                    }
                }
            }
        }

        // 获取参数中 response或request的参数
        Class<?>[] parameterTypes = method.getParameterTypes();
        for (int i = 0; i < parameterTypes.length; i++) {
            Class<?> parameterType = parameterTypes[i];
            if (parameterType == HttpServletRequest.class || parameterType == HttpServletResponse.class) {
                paramIndexMapping.put(parameterType.getName(), i);
            }
        }

    }

    public Object getController() {
        return controller;
    }

    public void setController(Object controller) {
        this.controller = controller;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public Pattern getUrl() {
        return url;
    }

    public void setUrl(Pattern url) {
        this.url = url;
    }

    public Map<String, Integer> getParamIndexMapping() {
        return paramIndexMapping;
    }

    public void setParamIndexMapping(Map<String, Integer> paramIndexMapping) {
        this.paramIndexMapping = paramIndexMapping;
    }
}
```

### 修改`initHandlerMapping`

```java
// 拼接的时候 为了避免出现多个 "//" 使用正则进行替换
String url = ("/" + baseUrl + "/" + requestMapping.value()).replaceAll("/+", "/");
Pattern pattern = Pattern.compile(url);
handlerMapping.add(new Handler(entry.getValue(), method, pattern));
System.out.println("Mapped " + url + "," + method);
```

### 修改`getHandler`
```java
private Handler getHandler(HttpServletRequest req) {
    if (handlerMapping.isEmpty()) return null;

    String url = req.getRequestURI();
    String contextPath = req.getContextPath();
    url = url.replace(contextPath, "").replaceAll("/+", "/");

    for (Handler handler : handlerMapping) {
        try {
            Matcher matcher = handler.getUrl().matcher(url);
            if (matcher.matches())
                return handler;
        } catch (Exception e) {
            throw e;
        }
    }
    return null;
}
```

### 编写测试类

```java
@GPRequestMapping("/edit.*")
public String edit(HttpServletRequest request) throws IOException {
    String requestURI = request.getRequestURI();
    return "正则匹配: " + requestURI;
}
```

### 执行结果

![](https://s1.ax1x.com/2020/03/29/GZS4bj.png)
![](https://s1.ax1x.com/2020/03/29/GZpCPx.png)


:::tip 项目地址
[GitHub](https://github.com/rookieHcy/GPSpringDemo)
:::
