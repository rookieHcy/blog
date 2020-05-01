---
title: 一言以蔽 · 设计模式
date: 2020-04-16 01:14:45
tags:
 - Java
 - 基础
 - 设计模式
categories:
 -  后端
---

:::tip 

想了西游记中的场景用来举例，百度一搜已经有人捷足先登了    
果然我能想到的别人早就想到了    
`_(:з」∠)_`
:::

<!-- more -->

## 设计原则 <Badge text="了解" type="warning" />

### 开闭原则
开闭原则(Open-Closed Principle, OCP)是指一个软件实体如类、模块和函数应该`对扩展开放，对修改关闭`。
所谓的开闭，也正是对扩展和修改两个行为的一个原则。强调 的是用抽象构建框架，用实现扩展细节。
可以提高软件系统的可复用性及可维护性。开闭原则，是面向对象设计中最基础的设计原则。它指导我们如何建立稳定灵活的系统，
例如:我们版本更新，我尽可能不修改源代码，但是可以增加新功能。 在现实生活中对于开闭原则也有体现。
比如，很多互联网公司都实行弹性制作息时间， 规定每天工作8 小时。意思就是说，对于每天工作 8 小时这个规定是关闭的，
但是你什么时候来，什么时候走是开放的。早来早走，晚来晚走。


### 依赖倒置原则
依赖倒置原则(Dependence Inversion Principle,DIP)是指设计代码结构时，高层模块不应该依赖底层模块，
二者都应该依赖其抽象。抽象不应该依赖细节;细节应该依赖 抽象。通过依赖倒置，可以减少类与类之间的耦合性，
提高系统的稳定性，提高代码的可读性和可维护性，并能够降低修改程序所造成的风险。

### 单一职责原则
单一职责(Simple Responsibility Pinciple，SRP)是指不要存在多于一个导致类变更的原因。假设我们有一个 Class负责两个职责，一旦发生需求变更，修改其中一个职责的
逻辑代码，有可能会导致另一个职责的功能发生故障。这样一来，这个 Class 存在两个导致类变更的原因。如何解决这个问题呢?我们就要给两个职责分别用两个 Class 来实现，
进行解耦。后期需求变更维护互不影响。这样的设计，可以降低类的复杂度，提高类的可读性，提高系统的可维护性，降低变更引起的风险。

### 接口隔离原则
接口隔离原则(Interface Segregation Principle, ISP)是指用多个专门的接口，而不使用单一的总接口，客户端不应该依赖它不需要的接口。
这个原则指导我们在设计接口时 应当注意一下几点:    
    1、一个类对一类的依赖应该建立在最小的接口之上。     
    2、建立单一接口，不要建立庞大臃肿的接口。     
    3、尽量细化接口，接口中的方法尽量少(不是越少越好，一定要适度)。    
接口隔离原则符合我们常说的高内聚低耦合的设计思想，从而使得类具有很好的可读性、 可扩展性和可维护性。我们在设计接口的时候，要多花时间去思考，要考虑业务模型，

### 迪米特法则
迪米特原则(Law of Demeter LoD)是指一个对象应该对其他对象保持最少的了解，又叫最少知道原则(Least Knowledge Principle,LKP)，
尽量降低类与类之间的耦合。迪米特原则主要强调只和朋友交流，不和陌生人说话。出现在成员变量、方法的输入、输出参数中的类都可以称之为成员朋友类，
而出现在方法体内部的类不属于朋友类。

### 里氏替换原则
里氏替换原则(Liskov Substitution Principle,LSP)是指如果对每一个类型为 T1 的对 象 o1,都有类型为 T2 的对象 o2,
使得以 T1 定义的所有程序 P 在所有的对象 o1 都替换成 o2 时，程序 P 的行为没有发生变化，那么类型 T2 是类型 T1 的子类型。
定义看上去还是比较抽象，我们重新理解一下，可以理解为一个软件实体如果适用一个 父类的话，那一定是适用于其子类，所有引用父
类的地方必须能透明地使用其子类的对 象，子类对象能够替换父类对象，而程序逻辑不变。根据这个理解，我们总结一下:     
    引申含义:子类可以扩展父类的功能，但不能改变父类原有的功能。     
        1、子类可以实现父类的抽象方法，但不能覆盖父类的非抽象方法。     
        2、子类中可以增加自己特有的方法。     
        3、当子类的方法重载父类的方法时，方法的前置条件(即方法的输入/入参)要比父类 方法的输入参数更宽松。     
        4、当子类的方法实现父类的方法时(重写/重载或实现抽象方法)，方法的后置条件(即 方法的输出/返回值)要比父类更严格或相等。    
使用里氏替换原则有以下优点:    
        1、约束继承泛滥，开闭原则的一种体现。     
        2、加强程序的健壮性，同时变更时也可以做到非常好的兼容性，提高程序的维护性、扩 展性。降低需求变更时引入的风险。    

### 合成复用原则
合成复用原则(Composite/Aggregate Reuse Principle,CARP)是指尽量使用对象组合(has-a)/聚合(contanis-a)，
而不是继承关系达到软件复用的目的。可以使系统更加灵 活，降低类与类之间的耦合度，
一个类的变化对其他类造成的影响相对较少。 继承我们叫做白箱复用，相当于把所有的实现细节暴露给子类。
组合/聚合也称之为黑箱 复用，对类以外的对象是无法获取到实现细节的。要根据具体的业务场景来做代码设计， 
其实也都需要遵循 OOP 模型。

## 工厂模式 <Badge text='重点'/> <Badge text='创建型' type='warning'/>

工厂模式分为简单工厂模式，工厂方法模式和抽象工厂模式，它们都属于设计模式中的创建型模式。其主要功能都是帮助我们把对象的实例化部分抽取了出来，目的是降低系统中代码耦合度，并且增强了系统的扩展性。

### 简单工厂模式

又称为静态工厂方法(Static Factory Method)模式，它属于类创建型模式。在简单工厂模式中，可以根据参数的不同返回不同类的实例。简单工厂模式专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类。

:::warning 提示

简单工厂模式不属于23种GOF中的设计模式。

:::

#### 示例

:::tip 

以《西游记》中师傅总被妖怪抓走了举例

:::

新建接口`IMonster`，妖怪都想吃唐僧肉，定义一个`eatTangSeng`方法

```java
package factory.simple_factory;

/**
 * @InterfaceName IMonster
 * @Description 妖怪接口，他们都想吃唐僧肉
 * @Author hou
 * @Date 2020/4/19 10:04 下午
 * @Version 1.0
 **/
public interface IMonster {
    void eatTangSeng();
}
```

创建两个妖怪类：`BaiGuJing` `DaPengNiao` 它们都实现了`IMonster`接口
```java
package factory.simple_factory;

/**
 * @ClassName BaiGuJing
 * @Description 白骨精
 * @Author hou
 * @Date 2020/4/19 10:08 下午
 * @Version 1.0
 **/
public class BaiGuJing implements IMonster{
    @Override
    public void eatTangSeng() {
        System.out.println("我是白骨精，我要吃唐僧肉");
    }
}
```

```java
package factory.simple_factory;

/**
 * @ClassName DaPengNiao
 * @Description 大鹏鸟
 * @Author hou
 * @Date 2020/4/19 10:12 下午
 * @Version 1.0
 **/
public class DaPengNiao implements IMonster{
    @Override
    public void eatTangSeng() {
        System.out.println("我是大鹏鸟，我要吃唐僧肉");
    }
}
```

创建工厂，含有一个`create`方法，只要传递妖怪的名字，工厂就会创造一个妖怪实例
```java
package factory.simple_factory;

/**
 * @ClassName MonsterFactory
 * @Description 妖怪工厂
 * @Author hou
 * @Date 2020/4/19 10:01 下午
 * @Version 1.0
 **/
public class MonsterFactory {

    IMonster create(String monsterName) {
        if("baigujing".equals(monsterName)){
            return new BaiGuJing();
        } else if("dapengniao".equals(monsterName)){
            return new DaPengNiao();
        }
        return null;
    }

}
```

编写测试类，分别测试`BaiGuJing` `DaPengNiao`
```java
package Factory;

import factory.simple_factory.IMonster;
import factory.simple_factory.MonsterFactory;
import org.junit.jupiter.api.Test;

/**
 * @ClassName TestSimpleFactory
 * @Description TODO
 * @Author hou
 * @Date 2020/4/19 10:21 下午
 * @Version 1.0
 **/
public class TestSimpleFactory {

    MonsterFactory factory = new MonsterFactory();

    /**
     * 测试白骨精
     */
    @Test
    public void testBaiGuJing(){
        IMonster baigujing = factory.create("baigujing");
        baigujing.eatTangSeng();
    }

  /**
     * 测试大鹏鸟
     */
    @Test
    public void testDaPengNiao(){
        IMonster dapengniao = factory.create("dapengniao");
        dapengniao.eatTangSeng();
    }

}
```

执行结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzfz3pcshj31c00u015f.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzfzpefe1j31c00u0alw.jpg)

假设此时，一个名叫`红孩儿`的妖怪也要吃唐僧肉，需要几步呢？    
新建`HongHaiEr`类
```java
package factory.simple_factory;

/**
 * @ClassName HongHaiEr
 * @Description 红孩儿
 * @Author hou
 * @Date 2020/4/19 10:33 下午
 * @Version 1.0
 **/
public class HongHaiEr implements IMonster{

    @Override
    public void eatTangSeng() {
        System.out.println("我是红孩儿，我要吃唐僧肉");
    }
}
```

在工厂中"注册"
```java
package factory.simple_factory;

/**
 * @ClassName MonsterFactory
 * @Description 妖怪工厂
 * @Author hou
 * @Date 2020/4/19 10:01 下午
 * @Version 1.0
 **/
public class MonsterFactory {

    public IMonster create(String monsterName) {
        if("baigujing".equals(monsterName)){
            return new BaiGuJing();
        } else if("dapengniao".equals(monsterName)){
            return new DaPengNiao();
        } else if("honghaier".equals(monsterName)){
            return new HongHaiEr();
        }
        return null;
    }

}
```

编写测试类，运行结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzgc9kfwej31c00u0am0.jpg)


类图如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzgk8ydjmj313i0jwabd.jpg)

#### 优点
只需要传入一个正确的参数，就可以获取所需的对象，无须知道其创建的细节。

#### 缺点
工厂类的职责相对过重，一旦有"产品"的增加或删除，整个工厂都要受到影响，违反了`开闭原则`，代码耦合度较高

#### 实际应用

Calendar中通过不同的时区获得不同的对象
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzhk6r1jfj31c00u0h0g.jpg)

Log4j通过类名字或者Class获取Logger
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzhpexm7vj31c00u04dd.jpg)

### 工厂方法模式
通过定义工厂父类负责定义创建对象的公共接口，而子类则负责生成具体的对象。将类的实例化（具体产品的创建）延迟到工厂类的子类（具体工厂）中完成，即由子类来决定应该实例化（创建）哪一个类。
                                    

#### 示例

:::tip 

以《西游记》中有后台的妖怪举例

:::

定义`妖怪`接口，还是想吃唐僧
```java
package factory.factory_method;

/**
 * @ClassName IMonster
 * @Description 妖怪接口
 * @Author hou
 * @Date 2020/4/19 11:43 下午
 * @Version 1.0
 **/
public interface IMonster {
    void eatTangSeng();
}
```

定义顶级工厂类，含有创建妖怪的抽象方法。
```java
package factory.factory_method;

/**
 * @ClassName MonsterFactory
 * @Description 顶级工厂类
 * @Author hou
 * @Date 2020/4/19 11:38 下午
 * @Version 1.0
 **/
public abstract class MonsterFactory {
    public abstract  IMonster create();
}
```

将妖怪按照后台划分为`佛教` `道家` 两种，分别创建具体工厂
```java
package factory.factory_method;

/**
 * @ClassName BuddhismFactory
 * @Description 后台为"佛教"的工厂
 * @Author hou
 * @Date 2020/4/19 11:47 下午
 * @Version 1.0
 **/
public class BuddhismFactory extends MonsterFactory{

    @Override
    public IMonster create() {
        return new Buddhism();
    }
}
```

```java
package factory.factory_method;

/**
 * @ClassName TaoistFactory
 * @Description 后台为"道家"的工厂
 * @Author hou
 * @Date 2020/4/19 11:47 下午
 * @Version 1.0
 **/
public class TaoistFactory extends MonsterFactory{

    @Override
    public IMonster create() {
        return new Taoist();
    }
}
```

创建两个对象实例
```java
package factory.factory_method;

/**
 * @ClassName Buddhism
 * @Description TODO
 * @Author hou
 * @Date 2020/4/20 12:31 上午
 * @Version 1.0
 **/
public class Buddhism implements IMonster {
    @Override
    public void eatTangSeng() {
        System.out.println("我的后台是佛教中人，我是佛祖的亲戚金翅大鹏鸟。");
        System.out.println("我的后台是佛教中人，我是文殊菩萨的坐骑青毛狮子。");
        System.out.println("我的后台是佛教中人，我是普贤菩萨的坐骑六牙白象。");
        System.out.println("我们要吃唐僧肉。");
    }
}
```

```java
package factory.factory_method;

/**
 * @ClassName Taoist
 * @Description TODO
 * @Author hou
 * @Date 2020/4/20 12:34 上午
 * @Version 1.0
 **/
public class Taoist implements IMonster {
    @Override
    public void eatTangSeng() {
        System.out.println("我的后台是道家中人，我是金角大王，太上老君门下看守金炉的童子。");
        System.out.println("我的后台是道家中人，我是银角大王，太上老君门下看守银炉的童子。");
        System.out.println("我们要吃唐僧肉。");
    }
}

```

编写测试类，运行结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzjyrhn7uj31c00u0gzj.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzjzpfrl4j31c00u0qg6.jpg)

新增无后台的"野生"妖怪工厂    
```java
package factory.factory_method;

/**
 * @ClassName WildFactory
 * @Description 野生工厂
 * @Author hou
 * @Date 2020/4/20 12:45 上午
 * @Version 1.0
 **/
public class WildFactory extends MonsterFactory{
    @Override
    public IMonster create() {
        return new Wild();
    }
}
```

添加实例对象
```java
package factory.factory_method;

/**
 * @ClassName Wild
 * @Description 野生实例
 * @Author hou
 * @Date 2020/4/20 12:45 上午
 * @Version 1.0
 **/
public class Wild implements IMonster {
    @Override
    public void eatTangSeng() {
        System.out.println("我是没有后台的白骨精，我想吃唐僧肉");
    }
}
```

测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzk4v09rqj31c00u014x.jpg)

#### 优点
新增"产品"符合了"开闭原则"，提高了系统的可扩展性

#### 缺点
类的个数容易过多，增加了代码结构的复杂性；增加了系统的抽象性和理解难度

### 抽象工厂模式 
提供一个创建一系列相关或者互相依赖对象的接口，无需指定他们的具体类

#### 实例

创建后台为`佛教` `道家`的实例接口
```java
package factory.abstract_factory;

/**
 * @ClassName IBuddhism
 * @Description 佛教后台的妖怪接口
 * @Author hou
 * @Date 2020/4/20 12:59 上午
 * @Version 1.0
 **/
public interface IBuddhism {
    void eatTangSeng();
}
```

```java
package factory.abstract_factory;

/**
 * @ClassName ITaoist
 * @Description 道家后台的妖怪接口
 * @Author hou
 * @Date 2020/4/20 12:59 上午
 * @Version 1.0
 **/
public interface ITaoist {
    void eatTangSeng();
}
```

创建后台为`佛教` `道家`的实例对象

```java
package factory.abstract_factory;

import factory.factory_method.IMonster;

/**
 * @ClassName Buddhism
 * @Description TODO
 * @Author hou
 * @Date 2020/4/20 12:31 上午
 * @Version 1.0
 **/
public class Buddhism implements IBuddhism {
    @Override
    public void eatTangSeng() {
        System.out.println("我的后台是佛教中人，我是佛祖的亲戚金翅大鹏鸟。");
        System.out.println("我的后台是佛教中人，我是文殊菩萨的坐骑青毛狮子。");
        System.out.println("我的后台是佛教中人，我是普贤菩萨的坐骑六牙白象。");
        System.out.println("我们要吃唐僧肉。");
    }
}
```

```java
package factory.abstract_factory;

/**
 * @ClassName Taoist
 * @Description TODO
 * @Author hou
 * @Date 2020/4/20 12:34 上午
 * @Version 1.0
 **/
public class Taoist implements ITaoist {
    @Override
    public void eatTangSeng() {
        System.out.println("我的后台是道家中人，我是金角大王，太上老君门下看守金炉的童子。");
        System.out.println("我的后台是道家中人，我是银角大王，太上老君门下看守银炉的童子。");
        System.out.println("我们要吃唐僧肉。");
    }
}
```

声明一个工厂接口可以生成两种对象
```java
package factory.abstract_factory;

/**
 * @InterfaceName IMonsterFactory
 * @Description 妖怪工厂接口
 * @Author hou
 * @Date 2020/4/20 1:03 上午
 * @Version 1.0
 **/
public interface IMonsterFactory {
    public IBuddhism createBuddhism();
    public ITaoist createTaoist();
}

```

声明一个工厂，实现工厂接口，并重写相应的方法
```java
package factory.abstract_factory;

/**
 * @ClassName MonsterFactory
 * @Description 妖怪工厂
 * @Author hou
 * @Date 2020/4/20 1:03 上午
 * @Version 1.0
 **/
public class MonsterFactory implements IMonsterFactory {
    @Override
    public IBuddhism createBuddhism() {
        return new Buddhism();
    }

    @Override
    public ITaoist createTaoist() {
        return new Taoist();
    }
}
```

编写测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzky3vecij31c00u0nbp.jpg)

新增无后台的"野生"妖怪实例接口
```java
package factory.abstract_factory;

/**
 * @ClassName IWild
 * @Description 无后台的野生妖怪接口
 * @Author hou
 * @Date 2020/4/20 12:59 上午
 * @Version 1.0
 **/
public interface IWild {
    void eatTangSeng();
}
```

添加实例对象
```java
package factory.abstract_factory;

/**
 * @ClassName Wild
 * @Description 野生妖怪
 * @Author hou
 * @Date 2020/4/20 12:31 上午
 * @Version 1.0
 **/
public class Wild implements IWild {
    @Override
    public void eatTangSeng() {
        System.out.println("我是没有后台的白骨精，我想吃唐僧肉");
    }
}
```

在工厂中添加生成新产品的方法
```java
package factory.abstract_factory;

/**
 * @InterfaceName IMonsterFactory
 * @Description 妖怪工厂接口
 * @Author hou
 * @Date 2020/4/20 1:03 上午
 * @Version 1.0
 **/
public interface IMonsterFactory {
    public IBuddhism createBuddhism();
    public ITaoist createTaoist();
    public IWild createWild();
}
```

```java
package factory.abstract_factory;

/**
 * @ClassName MonsterFactory
 * @Description 妖怪工厂
 * @Author hou
 * @Date 2020/4/20 1:03 上午
 * @Version 1.0
 **/
public class MonsterFactory implements IMonsterFactory {
    @Override
    public IBuddhism createBuddhism() {
        return new Buddhism();
    }

    @Override
    public ITaoist createTaoist() {
        return new Taoist();
    }

    @Override
    public IWild createWild() {
        return new Wild();
    }
}
```

测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdzl2iienfj31c00u0duz.jpg)
 
#### 优点
具体产品在应用层代码隔离，无须关心创建细节
将一个系列的产品族统一到一起创建

#### 缺点
规定了所有可能被创建的产品集合，产品族中扩展新的产品困难，需要修改抽象工厂的接口
增加了系统的抽象性和理解难度

:::warning 说明

虽然抽象工厂模式比工厂方法模式少创建了"子工厂"，同样也存在扩展性的问题。    
抽象工厂模式也不符合"开闭原则"

:::

## 单例模式 <Badge text='重点'/> <Badge text='创建型' type='warning'/>

:::tip 

我就是我，是颜色不一样的烟火            ---《我》

:::

单例模式是指确保一个类在任何情况下都绝对只有一个实例，并提供一个全局的访问点。

以《西游记》中自始至终都只有一个孙悟空为例（分身不算）

### 饿汉式单例

在单例首次加载时创建单例，无论会不会使用到这个实例都会进行创建。

```java
package singleton.hungry_singleton;

/**
 * @ClassName HungrySingleton
 * @Description 饿汉式单例
 * @Author hou
 * @Date 2020/4/20 12:49 下午
 * @Version 1.0
 **/
public class HungrySingleton {

    private static HungrySingleton INSTANCE = new HungrySingleton();

    // 构造方法私有化
    private HungrySingleton() {
    }

    // 提供全局访问点
    public static HungrySingleton getInstance(){
        return INSTANCE;
    }
}
```

编写测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0c5eqxfej31c00u018t.jpg)

#### 优点
只创建(new)了一次，不存在线程问题

#### 缺点
无论会不会对此对象进行使用，都会进行创建，浪费内存

### 懒汉式单例
对`饿汉式单例`的优化，在单例对象被调用时，创建对象

```java
package singleton.lazy_singleton;

/**
 * @ClassName LazySingleton
 * @Description 懒汉式单例
 * @Author hou
 * @Date 2020/4/20 1:05 下午
 * @Version 1.0
 **/
public class LazySingleton {

    private static LazySingleton INSTANCE = null;

    //  构造方法私有
    private LazySingleton() {
    }

    // 提供一个全局访问点
    public static LazySingleton getInstance() {
        if (null == INSTANCE) {
            INSTANCE = new LazySingleton();
        }
        return INSTANCE;
    }
}
```

编写测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0c6ftpkqj31c00u0qiu.jpg)

单线程模式下，岁月静好，还是只有一个"孙悟空"。多线程呢？

开启多线程测试代码，结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ccyaok5j31c00u0k7f.jpg)

再运行一遍
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cc92oqhj31c00u07kh.jpg)

:::danger 提示

懒汉式单例是线程不安全的！！！

:::

#### 一探究竟

编写测试代码，使用发令枪将主线程阻塞。
```java
 /**
 * 多线程条件下测试懒汉式单例 - 调试版本
 */
@Test
public void testConcurrentLazySingleton2() throws InterruptedException {
    // 线程数
    int threadNum = 2;
    CountDownLatch countDownLatch = new CountDownLatch(threadNum);
    for (int i = 0; i < threadNum; i++) {
        new Thread(() -> {
            LazySingleton instance = LazySingleton.getInstance();
            System.out.println(Thread.currentThread().getName() + ": " + instance);

            countDownLatch.countDown();
        }).start();
    }
    countDownLatch.await();
}
```

在判断instance是否为空的代码出添加断点，右键，设置为线程模式
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ce10eq4j31c00u0aor.jpg)

情况一：`多线程使用同一个对象`   
线程一到达判断逻辑
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cfy4pmrj31c00u0tnp.jpg)
线程一进入方法，并创建instance对象
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cgdc57vj31c00u07i5.jpg)
线程一输出结果`singleton.SunWuKong@e47173e`
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cgqj0slj31c00u07ig.jpg)
线程二执行判断逻辑，此时instance不为空，直接返回
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0chbtyyjj31c00u016k.jpg)
最终执行结果
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0chtpgcgj31c00u07ii.jpg)

情况二：`多线程创建了不同对象`    
线程一到达判断逻辑，结果为真，进入方法体
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ciayq3aj31c00u016d.jpg)
线程二也到达判断逻辑，结果为真，也进入方法体
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cipz96sj31c00u0qgk.jpg)
线程二执行创建instance对象，并结束线程
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cjdw71kj31c00u07id.jpg)
线程一继续执行方法体，创建instance对象，并结束线程
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cjxk57uj31c00u016h.jpg)
最终结果
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ck88xvhj31c00u0qh3.jpg)

情况三：`线程将先创建的实例覆盖`    
线程一到达判断逻辑，结果为真，进入方法体
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cl4jnqbj31c00u0ann.jpg)
线程二也到达判断逻辑，结果为真，也进入方法体
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cljq8yqj31c00u0ano.jpg)
线程一继续执行，创建instance对象
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cm33ouzj31c00u0k55.jpg)
线程二继续执行，将线程一创建的instance对象覆盖
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cmh6q4nj31c00u0k55.jpg)
线程二结束线程
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cmtz2qjj31c00u0gzk.jpg)
线程一结束线程，最终结果
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cn5wqpyj31c00u0anv.jpg)

:::tip     
通透！
:::

### 懒汉式双重检查单例

既然判断线程问题发生在逻辑判断处，在此处加锁是否可以解决问题呢？    
锁加在那里？

#### 同步方法
效率比较低，性能不是太好，不过也可以用，因为是对整个方法加上了线程同步，其实只要在new的时候考虑线程同步就行了，
这种方法不推荐使用

```java
package singleton.lazy_singleton;

/**
 * @ClassName LockLazySingleton
 * @Description 同步方法懒汉式单例
 * @Author hou
 * @Date 2020/4/20 1:05 下午
 * @Version 1.0
 **/
public class LockMethodLazySingleton {

    private static LockMethodLazySingleton INSTANCE = null;

    //  构造方法私有
    private LockMethodLazySingleton() {
    }

    // 提供一个全局访问点
    public synchronized static LockMethodLazySingleton getInstance() {
        if (null == INSTANCE) {
            INSTANCE = new LockMethodLazySingleton();
        }
        return INSTANCE;
    }
}
```

#### 锁对象
synchronized同步块括号中的锁定对象是采用的一个无关的Object类实例，而不是采用this，因为getInstance是一个静态方法，在它内部不能使用未静态的或者未实例的类对象

```java
package singleton.lazy_singleton;

/**
 * @ClassName LockObjectLazySingleton
 * @Description 同步代码块懒汉式单例
 * @Author hou
 * @Date 2020/4/20 1:05 下午
 * @Version 1.0
 **/
public class LockObjectLazySingleton {

    private static LockObjectLazySingleton INSTANCE = null;
    private static final Object lock = new Object();

    //  构造方法私有
    private LockObjectLazySingleton() {
    }

    // 提供一个全局访问点
    public static LockObjectLazySingleton getInstance() {
        if (null == INSTANCE) {
            synchronized (lock) {
                INSTANCE = new LockObjectLazySingleton();
            }
        }
        return INSTANCE;
    }
}
```

#### 锁类
也可以通过锁类的方式实现
```java
package singleton.lazy_singleton;

/**
 * @ClassName LockClassLazySingleton
 * @Description 同步代码块懒汉式单例
 * @Author hou
 * @Date 2020/4/20 1:05 下午
 * @Version 1.0
 **/
public class LockClassLazySingleton {

    private static LockClassLazySingleton INSTANCE = null;

    //  构造方法私有
    private LockClassLazySingleton() {
    }

    // 提供一个全局访问点
    public static LockClassLazySingleton getInstance() {
        if (null == INSTANCE) {
            synchronized (LockClassLazySingleton.class) {
                INSTANCE = new LockClassLazySingleton();
            }
        }
        return INSTANCE;
    }
}
```

编写测试类测试接口，结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cp2p9l6j31c00u0wun.jpg)

多线程问题再次出现！

编写测试类，打断点
```java
/**
 * 多线程条件下测试懒汉式单例 - 调试版本
 */
@Test
public void testLockClassLazySingleton2() throws InterruptedException {
    // 线程数
    int threadNum = 2;
    CountDownLatch countDownLatch = new CountDownLatch(threadNum);
    for (int i = 0; i < threadNum; i++) {
        new Thread(() -> {
            LockClassLazySingleton instance = LockClassLazySingleton.getInstance();
            System.out.println(instance);

            countDownLatch.countDown();
        }).start();
    }
    countDownLatch.await();
}
```
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0cqd18lgj31c00u0h0t.jpg)

#### 一探究竟

（只演示一种情况）

线程一判断instance为空，到达同步代码块
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0crvb5ohj31c00u0dv1.jpg)
线程二判断instance为空，也到达同步代码块
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0csar043j31c00u0180.jpg)
线程二进入同步代码块，此时，线程一为阻塞状态
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge09zd6awoj31c00u0tn1.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d06hs0oj31c00u0tmu.jpg)
线程二执行完毕
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d0kw68jj31c00u0wtv.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d0yppfvj31c00u04cn.jpg)
线程一切换为运行态，继续执行，再一次创建了对象
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d1gf1pqj31c00u0ncj.jpg)
最终结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d21f7j4j31c00u0wsw.jpg)

#### 双重检查锁
因为问题出现在同步代码块内部，将同步代码块中加入一个实例是否为空的校验，进行双重检查

```java
package singleton.lazy_singleton;

/**
 * @ClassName DoubleCheckLazySingleton
 * @Description 双重校验锁懒汉式单例
 * @Author hou
 * @Date 2020/4/20 1:05 下午
 * @Version 1.0
 **/
public class DoubleCheckLazySingleton {

    private static DoubleCheckLazySingleton INSTANCE = null;

    //  构造方法私有
    private DoubleCheckLazySingleton() {
    }

    // 提供一个全局访问点
    public static DoubleCheckLazySingleton getInstance() {
        if (null == INSTANCE) {
            synchronized (DoubleCheckLazySingleton.class) {
                if (null == INSTANCE) {
                    INSTANCE = new DoubleCheckLazySingleton();
                }
            }
        }
        return INSTANCE;
    }
}
```

编写测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d2zmkf3j31c00u07k4.jpg)

虽然上面的代码看似完美，仍然存在指令重排序问题，需要在实例对象前加上`volatile`关键字禁止指令重排序。    
[单例陷阱——双重检查锁中的指令重排问题](https://www.cnblogs.com/lkxsnow/p/12293791.html)

#### 优点
保证了对象在系统中只有一个实例

#### 缺点
同步方法和多重判断导致效率较低

### 静态内部类

外部类加载时并不需要立即加载内部类，内部类不被加载则不去初始化INSTANCE，故而不占内存，而且从jvm层面保证了线程的安全。

```java
package singleton.inner_class_singleton;

/**
 * @ClassName InnerClassSingleton
 * @Description 内部类式单例
 * @Author hou
 * @Date 2020/4/20 4:05 下午
 * @Version 1.0
 **/
public class InnerClassSingleton {

    private static class SingletonHolder {
        private final static InnerClassSingleton SUN_WU_KONG = new InnerClassSingleton();
    }

    // 构造方法私有化
    private InnerClassSingleton() { }

    // 提供全局访问点
    public static InnerClassSingleton getInstance(){
        return SingletonHolder.SUN_WU_KONG;
    }
}
```

编写测试代码，执行结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0d48m8o7j31c00u0ap5.jpg)

:::tip
由于是内部类的原因，单例对象在创建时不支持动态传参，除此，内部类单例几近完美
:::

### 枚举式单例

:::warning    
假设我非要搞破坏呢？    
:::

以最初的饿汉式单例为基础。

#### 反射攻击

通过反射获取类的私有构造方法，使用setAccessible启用访问安全检查的开关，通过构造方法创建出新的"单例对象"
```java
 /**
 * 暴力反射 破坏单例
 * @throws Exception
 */
@Test
public void testReflect() throws Exception {
    // 获取单例对象
    HungrySingleton instance = HungrySingleton.getInstance();
    System.out.println(instance);

    // 通过反射 暴力创建一个对象
    Constructor<HungrySingleton> constructor = HungrySingleton.class.getDeclaredConstructor();
    constructor.setAccessible(true);
    HungrySingleton hungrySingleton = constructor.newInstance();

    System.out.println(hungrySingleton);
}
```

解决方案：在构造方法里边添加判断逻辑，如果已经实例化过的对象，再次调用构造方法，抛出异常
```java
package singleton.hungry_singleton;

/**
 * @ClassName HungrySingleton
 * @Description 饿汉式单例
 * @Author hou
 * @Date 2020/4/20 12:49 下午
 * @Version 1.0
 **/
public class HungrySingleton2 {

    private static HungrySingleton2 INSTANCE = new HungrySingleton2();

    // 构造方法私有化
    private HungrySingleton2() {
        if(null != INSTANCE){
            throw new RuntimeException("单例对象已经存在，不允许再次调用构造方法");
        }
    }

    // 提供全局访问点
    public static HungrySingleton2 getInstance(){
        return INSTANCE;
    }
}

```

测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0j7hyvozj31c00u0dw2.jpg)

#### 序列化攻击

:::warning    
假设我还要搞破坏呢？    
:::

复制一个饿汉式单例，并实现序列化接口
```java
package singleton.hungry_singleton;

import java.io.Serializable;

/**
 * @ClassName HungrySingleton3
 * @Description 饿汉式单例
 * @Author hou
 * @Date 2020/4/20 12:49 下午
 * @Version 1.0
 **/
public class HungrySingleton3 implements Serializable {

    private static HungrySingleton3 INSTANCE = new HungrySingleton3();

    // 构造方法私有化
    private HungrySingleton3() {
    }

    // 提供全局访问点
    public static HungrySingleton3 getInstance(){
        return INSTANCE;
    }
}

```

通过序列化后反序列化生成新的对象，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0jkui96vj31c00u0toa.jpg)

解决方案：
1. 不实现序列化接口
2. 在单例类中添加`readResolve()`方法，反序列化时，如果定义了readResolve()则直接返回此方法指定的对象。而不需要单独再创建新对象
```java
private Object readResolve(){
    return INSTANCE;
}
```

再次执行测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0k6nck9cj31c00u0dvl.jpg)

相关代码
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0k9iw5uwj31c00u04dy.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0k9w2m9xj31c00u04hk.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0kakfer1j31c00u04gl.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0kc327gdj31c00u0wwj.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0kcjxx26j31c00u0ask.jpg)

## 原型模式 <Badge text='创建型' />
原型模式（Prototype）：用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

### 示例

:::tip 
《西游记》中孙悟空可以"拔一根毫毛，吹出猴万个"，原型模式就以此举例
:::

定义一个接口。包含一个`clone`方法
```java
package prototype;

/**
 * @InterfaceName IPrototype
 * @Description 原型模式接口
 * @Author hou
 * @Date 2020/4/21 10:16 下午
 * @Version 1.0
 **/
public interface IPrototype<T> {
     T clone();
}
```

新建`金箍棒`类
```java
package prototype;

import lombok.Data;

/**
 * @ClassName Weapon
 * @Description 武器
 * @Author hou
 * @Date 2020/4/21 5:25 下午
 * @Version 1.0
 **/
@Data
public class Weapon {

    private String name = "如意金箍棒，一万三千五百斤";

}
```

新建`孙悟空`类，有一个武器`金箍棒`，实现`IPrototype`接口
```java
package prototype;

import lombok.Data;

/**
 * @ClassName SunWuKong
 * @Description 孙悟空
 * @Author hou
 * @Date 2020/4/21 5:24 下午
 * @Version 1.0
 **/
@Data
public class SunWuKong implements IPrototype<SunWuKong>{

    private String type = "石猴";
    private String gender = "公";
    private Weapon jinGuBang = new Weapon();

    @Override
    public SunWuKong clone() {
        SunWuKong sunWuKong = new SunWuKong();
        sunWuKong.setGender(this.gender);
        sunWuKong.setType(this.type);
        sunWuKong.setJinGuBang(this.jinGuBang);
        return sunWuKong;
    }
}
```

编写测试代码，测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge1r45st59j31c00u0k7j.jpg)

从结果可见，除了复制的本体不一样，里边包含的属性均相同，包括`金箍棒`，可是复制出来的"猴子"不应该拥有相同的金箍棒
这种情况被称为`浅克隆`

#### 浅克隆
浅克隆，用来创建一个新的对象，然后将当前对象的非静态字段复制到新对象，如果该字段是值类型的，则对该字段执行逐位复制，如果该字段是引用类型的，则复制引用但不复制引用的对象。

所有类的父类`Object`中也包含了一个`浅克隆`的实现

编写代码
```java
package prototype;

import lombok.Data;

/**
 * @ClassName SunWuKong
 * @Description 孙悟空
 * @Author hou
 * @Date 2020/4/21 5:24 下午
 * @Version 1.0
 **/
@Data
public class SunWuKong2 implements Cloneable{

    private String type = "石猴";
    private String gender = "公";
    private Weapon jinGuBang = new Weapon();

    @Override
    public SunWuKong2 clone() throws CloneNotSupportedException {
        return (SunWuKong2) super.clone();
    }
}
```
测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge1rk97f3uj31c00u0wv2.jpg)

:::tip 提示    
Cloneable接口中并没有实质性的方法，仅仅是一个标记作用；如果直接重写了clone方法，但是没有实现接口的话会抛出`CloneNotSupportedException`异常。    
`clone`方法在`Object`中是`protected`的，可以在子类中进行扩大可见范围。    
:::


### 深克隆
要想让每一个分身都有一根"金箍棒"就要用到深克隆    
深克隆：用来创建一个新的对象，都含有与原来对象相同的值，除了那些引用其他对象的变量。那些引用其他对象的变量将指向一个被复制的新对象，而不再是原有那些被引用对象。即深克隆把要复制的对象所引用的对象也都复制了一次，而这种对被引用到的对象克隆叫做间接克隆。

重新定义一个`孙悟空`类，通过序列化反序列化克隆一个新的`孙悟空`
```java
package prototype;

import lombok.Data;

import java.io.*;

/**
 * @ClassName SunWuKong
 * @Description 孙悟空
 * @Author hou
 * @Date 2020/4/21 5:24 下午
 * @Version 1.0
 **/
@Data
public class SunWuKong3 implements Cloneable, Serializable {

    private String type = "石猴";
    private String gender = "公";
    private Weapon jinGuBang = new Weapon();

    @Override
    public SunWuKong3 clone() throws CloneNotSupportedException {
        return (SunWuKong3) super.clone();
    }

    public SunWuKong3 deepClone() throws IOException, ClassNotFoundException {
        // 写出
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(this);

        // 读入
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bos.toByteArray()));
        
        return (SunWuKong3)ois.readObject();
    }
}
```

测试结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge1s7s11cjj31c00u018y.jpg)

:::tip    
此时的武器应该实现序列化接口    
:::

#### 优点
可以方便的创建一个对象

#### 缺点
使用深克隆浅克隆需要考虑性能的问题，在大量的深克隆中效率不高

## 代理模式

### 定义
### 静态代理
### 动态代理
### jdk
### cglib

## 策略模式 
## 模板模式
## 适配器模式
## 装饰者模式
## 观察者模式
观察者模式又叫发布-订阅模式（Publish/Subsctibe），定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态发生变化时，会通知所有观察者对象，使它们能够自己更新自己。



## 享元模式 <Badge text='结构型' />
享元模式（Flyweight Pattern）：运用共享技术有效地支持大量细粒度的对象。用于减少创建对象的数量，以减少内存占用和提高性能。
在软件开发过程中，如果有使用大量相同的对象，只要共享一个就可以，这就是享元模式，减少了不必要的内存消耗。

享元模式由以下部分组成:

抽象享元类（Flyweight）: 所有具体享元类的超类或者接口，通过这个接口，Flyweight可以接受并作用于外部。    
具体享元类（ConcreteFlyweight）：指定内部状态，为内部状态增加存储空间。    
享元工厂类（FlyweightFactory）：用来创建并管理Flyweight对象，它主要用来确保合理地共享Flyweight，当用户请求一个Flyweight时，FlyweightFactory就会提供一个已经创建的Flyweight对象或者新建一个（如果不存在）。

### 示例

:::tip
唐僧西天取经期间收徒`孙悟空` `猪悟能` `沙悟净` `白龙马`，取经过程中`孙悟空`总是被唐僧驱逐，模拟此过程
:::

定义`徒弟接口`（抽象享元接口）
```java
package flyweight;

/**
 * @InterfaceName IApprentice
 * @Description 徒弟接口
 * @Author hou
 * @Date 2020/4/22 12:13 上午
 * @Version 1.0
 **/
public interface IApprentice {
}

```

定义三个徒弟类(具体享元类)`孙悟空` `猪悟能` `沙悟净`
```java
package flyweight;

/**
 * @ClassName SuWukong
 * @Description 孙悟空
 * @Author hou
 * @Date 2020/4/22 12:10 上午
 * @Version 1.0
 **/
public class SunWuKong implements IApprentice{
    @Override
    public String toString() {
        return "神通广大的孙悟空";
    }
}
``` 

```java
package flyweight;

/**
 * @ClassName ZhuBaJie
 * @Description 猪八戒
 * @Author hou
 * @Date 2020/4/22 12:10 上午
 * @Version 1.0
 **/
public class ZhuBaJie implements IApprentice{
    @Override
    public String toString() {
        return "好吃懒做的猪悟能";
    }
}
``` 

```java
package flyweight;

/**
 * @ClassName ShaWuJing
 * @Description 沙悟净
 * @Author hou
 * @Date 2020/4/22 12:10 上午
 * @Version 1.0
 **/
public class ShaWuJing implements IApprentice{
    @Override
    public String toString() {
        return "憨厚老实的沙悟净";
    }
}
``` 

创建一个徒弟工厂（简单工厂）
```java
package flyweight;

/**
 * @ClassName ApprenticeFactory
 * @Description TODO
 * @Author hou
 * @Date 2020/4/22 12:25 上午
 * @Version 1.0
 **/
public class ApprenticeFactory {
    public static IApprentice apprentice(String name){
        if("孙悟空".equals(name)){
            return new SunWuKong();
        } else if("猪悟能".equals(name)){
            return new ZhuBaJie();
        } else if("沙悟净".equals(name)){
            return new ShaWuJing();
        }
        return null;
    }
}
```

定义西游记类（享元工厂类）
```java
package flyweight;

import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName Journey2TheWest
 * @Description TODO
 * @Author hou
 * @Date 2020/4/22 12:22 上午
 * @Version 1.0
 **/
public class Journey2TheWest {

    // 保存对象
    private Map<String, IApprentice> cacheFactory = new HashMap<>();

    // 如果缓存没有对象，此处就存起来；如果缓存有对象，此处就不进行处理
    public void apprentice(String name){
        cacheFactory.putIfAbsent(name, ApprenticeFactory.apprentice(name));
    }
    
    public void print(){
        cacheFactory.forEach((k, v) -> System.out.println(String.format("name: %s, desc: %s", k, v)));
    }
}
```

编写测试代码，结果如下：
![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge1v2wepp8j31c00u0k89.jpg)

### 优点
享元模式的优点在于它能够极大的减少系统中对象的个数。    
享元模式由于使用了外部状态，外部状态相对独立，不会影响到内部状态，所以享元模式使得享元对象能够在不同的环境被共享。


 
## 参考链接
[关于三种工厂模式的总结](https://www.jianshu.com/p/70f7fd47f2e2)    
[单例模式（Singleton）的同步锁synchronized](https://www.cnblogs.com/qq895139140/p/7774152.html)    
[设计模式（Design Pattern）](https://blog.csdn.net/u012482647/article/details/78562486)    
