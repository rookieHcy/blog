---
title: 一言以蔽·HashMap
date: 2020-04-13 21:33:26
tags:
 - Java
 - 基础
categories:
 -  后端
---


## 准备阶段
 + 复制`jdk源码`中的`AbstractMap` `HashMap` `LinkedHashMap`到新的路径下

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsi4y450yj30g206wmxl.jpg)

+ 类或者接口之间的依赖关系
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsibvzj4lj31c00u0jz2.jpg)

+ 修改`HashMap`为`HashMap8`，与jdk中的map区分开
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsifsn1hxj30jk0bcmy3.jpg)

+ 可以适当的删除一些注释

## 变量或对象
### 默认初始容量
默认的初始容量为1左移4位即16，初始容量`必须`为2的整数幂
```java
/**
 * The default initial capacity - MUST be a power of two.
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
```

:::danger
当初始容量设置不为2的整数幂会发生什么呢？
:::

1. 编写测试代码
```java
/**
 * 测试当初始化HashMap时，初始容量不设置为2的整数次幂会发生什么?
 */
@Test
public void test2(){
    HashMap8<Integer, Integer> hashMap8 = new HashMap8<>(3);
}
```
:::tip 提示
    1 = 2^0
:::
2. 调用单参数构造函数，参数为初始容量，以默认加载因子调用双参构造函数。
```java
/**
 * Constructs an empty <tt>HashMap</tt> with the specified initial
 * capacity and the default load factor (0.75).
 *
 * @param  initialCapacity the initial capacity.
 * @throws IllegalArgumentException if the initial capacity is negative.
 */
public HashMap8(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}
```

3. 调用双参构造函数，参数为`初始容量` `加载因子`。当`初始容量`小于0时抛出异常；大于HashMap最大容量`1<<30`，赋值容量为最大值；调用`tableSizeFor`方法。
```java
/**
 * Constructs an empty <tt>HashMap</tt> with the specified initial
 * capacity and load factor.
 *
 * @param  initialCapacity the initial capacity
 * @param  loadFactor      the load factor
 * @throws IllegalArgumentException if the initial capacity is negative
 *         or the load factor is nonpositive
 */
public HashMap8(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```

4. `tableSizeFor`方法

官翻：根据给定的目标容量返回2的整数幂
```
/**
 * Returns a power of two size for the given target capacity.
 */
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

5.1 看不懂`tableSizeFor`，改之(输出日志)
```java
/**
 * Returns a power of two size for the given target capacity.
 */
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    System.out.println("after n>>>1, n = " + n + ", 2进制 = " + Integer.toBinaryString(n));
    n |= n >>> 2;
    System.out.println("after n>>>2, n = " + n + ", 2进制 = " + Integer.toBinaryString(n));
    n |= n >>> 4;
    System.out.println("after n>>>4, n = " + n + ", 2进制 = " + Integer.toBinaryString(n));
    n |= n >>> 8;
    System.out.println("after n>>>8, n = " + n + ", 2进制 = " + Integer.toBinaryString(n));
    n |= n >>> 16;
    System.out.println("after n>>>16, n = " + n + ", 2进制 = " + Integer.toBinaryString(n));

    System.out.println("final n = " + ((n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1));
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

5.2 修改测试类，观察输出结果
```java
/**
 * 测试当初始化HashMap时，初始容量不设置为2的整数次幂会发生什么?
 */
@Test
public void test2(){
    int[] ints = {9, 20, 64, 65};
    for (int anInt : ints) {
        System.out.println("current initialCapacity is " + anInt);
        new HashMap8<>(anInt);
        System.out.println();
    }
}
```
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdskpmcxejj31c00u0gwj.jpg)

返回值均为大于等于给定容量的2的整数次幂！

5.3 理性分析

先说明 `|=`的作用：`a |= b` 等同于 `a = a|b`。

```java
// 给定的cap减1，是为了避免参数cap本来就是2的幂次方，这样一来，经过后续的未操作的，cap将会变成2 * cap,是不符合我们预期的。
int n = cap - 1

// n >>> 1，n无符号右移1位，即n二进制最高位的1右移一位 n | (n >>> 1)，导致的结果是n二进制的高2位值为1;
// 目前n的高1~2位均为1。
n |= n >>> 1 


// n继续无符号右移2位。 n | (n >>> 2)，导致n二进制表示高3~4位经过运算值均为1；
// 目前n的高1~4位均为1。
n |= n >>> 2 


// n继续无符号右移4位 n | (n >>> 4)，导致n二进制表示高5~8位经过运算值均为1；
// 目前n的高1~8位均为1。
n |= n >>> 4 


// n继续无符号右移8位。 n | (n >>> 8)，导致n二进制表示高9~16位经过运算值均为1；
// 目前n的高1~16位均为1。
n |= n >>> 8 


// n继续无符号右移16位。n | (n >>> 16)，导致n二进制表示高17~32位经过运算值均为1；
// 目前n的高1~32位均为1。
n |= n >>> 16 

```
可以看出，无论给定cap(cap < MAXIMUM_CAPACITY )的值是多少，经过以上运算，其值的二进制所有位都会是1。再将其加1，这时候这个值一定是2的幂次方。当然如果经过运算值大于MAXIMUM_CAPACITY，直接选用MAXIMUM_CAPACITY。

:::tip 提示
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdslg5g7qqj30yq0fstaa.jpg)
:::


### 最大容量
最大容量为1左移30位，即2^30
```java
/**
 * The maximum capacity, used if a higher value is implicitly specified
 * by either of the constructors with arguments.
 * MUST be a power of two <= 1<<30.
 */
static final int MAXIMUM_CAPACITY = 1 << 30;
```

### 默认加载因子
构造函数未指定加载因子时候的默认值0.75f。
```java
/**
 * The load factor used when none specified in constructor.
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```

### 树化负载因子
官翻：使用树而不是列表列出容器的容器计数阈值。将元素添加到至少具有这么多节点的容器中时，容器将转换为树。该值必须大于2，并且至少应为8才能与树删除的假设有关，即收缩时转换回原始分类箱的假设。
当同一个数组下标下含有元素数量达到`TREEIFY_THRESHOLD = 8`个时，将链表转为红黑树。
```java
/**
 * The bin count threshold for using a tree rather than list for a
 * bin.  Bins are converted to trees when adding an element to a
 * bin with at least this many nodes. The value must be greater
 * than 2 and should be at least 8 to mesh with assumptions in
 * tree removal about conversion back to plain bins upon
 * shrinkage.
 */
static final int TREEIFY_THRESHOLD = 8;
```

### 去除树化负载因子
官翻：在调整大小操作过程中，不将a（分割）箱拆放的bin计数阈值。应该小于treeify阈值，最多6个与收缩检测相吻合。
当同一个数组下标下含有不超过`UNTREEIFY_THRESHOLD = 6`个时，将红黑树转为链表。

```java
/**
 * The bin count threshold for untreeifying a (split) bin during a
 * resize operation. Should be less than TREEIFY_THRESHOLD, and at
 * most 6 to mesh with shrinkage detection under removal.
 */
static final int UNTREEIFY_THRESHOLD = 6;
```

### 最小树化容量
官翻：最小的表容量，可以使bin被树化。（否则，如果一个箱子里有太多的节点，表就会被调整。应该至少4 * TREEIFY_THRESHOLD，以避免调整大小和树化阈值之间的冲突。
采用红黑树替代链表的最小容量。
```java
/**
 * The smallest table capacity for which bins may be treeified.
 * (Otherwise the table is resized if too many nodes in a bin.)
 * Should be at least 4 * TREEIFY_THRESHOLD to avoid conflicts
 * between resizing and treeification thresholds.
 */
static final int MIN_TREEIFY_CAPACITY = 64;
```

### 节点
`Node`实现了`Map.Entry`接口，作为数组的组成元素。
包含`hash哈希` `key键` `value值` `next对象指针`，同时重写了`equals`方法和`toString`方法。
```java
 static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
}
```

### table
官翻：在第一次使用的时候初始化，在需要时进行resize；当扩容后，数组的长度一定为2的整数次幂
```
/**
 * The table, initialized on first use, and resized as
 * necessary. When allocated, length is always a power of two.
 * (We also tolerate length zero in some operations to allow
 * bootstrapping mechanics that are currently not needed.)
 */
transient Node<K,V>[] table;
```

:::tip 提示
java 的transient关键字为我们提供了便利，你只需要实现Serilizable接口，将不需要序列化的属性前添加关键字transient，序列化对象的时候，这个属性就不会序列化到指定的目的地中。
:::

### entrySet
官翻：保存缓存entrySet()。 AbstractMap字段用于keySet（）和values（）。
```java
/**
 * Holds cached entrySet(). Note that AbstractMap fields are used
 * for keySet() and values().
 */
transient Set<Map.Entry<K,V>> entrySet;
```

### size
官翻：map中键值对的个数
```java
/**
 * The number of key-value mappings contained in this map.
 */
transient int size;
```

### modCount
官翻：此HashMap被结构修改的次数。结构修改是指那些更改了HashMap或以其他方式修改其内部结构（例如rehash).此字段用于在以下集合层面上对HashMap的迭代进行`fail-fast`

modCount用于记录HashMap的修改次数,在HashMap的put(),get(),remove(),Interator()等方法中,都使用了该属性.由于HashMap不是线程安全的,所以在迭代的时候,会将modCount赋值到迭代器的expectedModCount属性中,然后进行迭代,如果在迭代的过程中HashMap被线程（包括自己）修改了,modCount的数值就会发生变化,这个时候expectedModCount和ModCount不相等,迭代器就会抛出ConcurrentModificationException()异常.
```java
/**
 * The number of times this HashMap has been structurally modified
 * Structural modifications are those that change the number of mappings in
 * the HashMap or otherwise modify its internal structure (e.g.,
 * rehash).  This field is used to make iterators on Collection-views of
 * the HashMap fail-fast.  (See ConcurrentModificationException).
 */
transient int modCount;
```

测试代码
```java
/**
 * 测试ConcurrentModificationException
 */
@Test
public void test3(){
    HashMap8<Integer, Integer> hashMap8 = new HashMap8<Integer, Integer>(){{
        put(1, 1);
        put(2, 2);
    }};

    Iterator<Map.Entry<Integer, Integer>> iterator = hashMap8.entrySet().iterator();
    while(iterator.hasNext()){
        Map.Entry<Integer, Integer> next = iterator.next();
        hashMap8.remove(2);
    }
}
```

测试截图
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsmunweavj31c00u0dt4.jpg)

### threshold
官翻：下一次触发reszie的阈值 （容量 * 加载因子）
```java
/**
 * The next size value at which to resize (capacity * load factor).
 *
 * @serial
 */
// (The javadoc description is true upon serialization.
// Additionally, if the table array has not been allocated, this
// field holds the initial array capacity, or zero signifying
// DEFAULT_INITIAL_CAPACITY.)
int threshold;
```

### loadFactor
加载因子，`final`修饰，在创建对象之前完成赋值（构造器）
```java
/**
 * The load factor for the hash table.
 *
 * @serial
 */
final float loadFactor;
```

## 方法

### 构造函数

无参构造函数，所有值都采用默认值
```java
 /**
 * Constructs an empty <tt>HashMap</tt> with the default initial capacity
 * (16) and the default load factor (0.75).
 */
public HashMap8() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}
```

:::tip 提示
两个构造函数已经在上面提到了
:::

官翻：构造一个新的“HashMap”，它的映射与指定的“Map”映射相同。HashMap是用默认的load因子（0.75f）和初始容量来创建的，它足以容纳指定的映射表中的映射。

```java
/**
 * Constructs a new <tt>HashMap</tt> with the same mappings as the
 * specified <tt>Map</tt>.  The <tt>HashMap</tt> is created with
 * default load factor (0.75) and an initial capacity sufficient to
 * hold the mappings in the specified <tt>Map</tt>.
 *
 * @param   m the map whose mappings are to be placed in this map
 * @throws  NullPointerException if the specified map is null
 */
public HashMap8(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```

官翻： `evict： 驱逐` 中继与`afterNodeInsertion`方法
```java
/**
 * Implements Map.putAll and Map constructor.
 *
 * @param m the map
 * @param evict false when initially constructing this map, else
 * true (relayed to method afterNodeInsertion).
 */
final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
    int s = m.size();
    if (s > 0) {
        if (table == null) { // pre-size
            float ft = ((float)s / loadFactor) + 1.0F;
            int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                     (int)ft : MAXIMUM_CAPACITY);
            if (t > threshold)
                threshold = tableSizeFor(t);
        }
        else if (s > threshold)
            resize();
        for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
            K key = e.getKey();
            V value = e.getValue();
            putVal(hash(key), key, value, false, evict);
        }
    }
}
```

### size()
返回当前map中的键值对的个数
```java
/**
 * Returns the number of key-value mappings in this map.
 *
 * @return the number of key-value mappings in this map
 */
public int size() {
    return size;
}
```

### isEmpty()
返回当前map中是否含有键值对（map是否为空）
```java
/**
 * Returns <tt>true</tt> if this map contains no key-value mappings.
 *
 * @return <tt>true</tt> if this map contains no key-value mappings
 */
public boolean isEmpty() {
    return size == 0;
}
```

### hash <Badge text="重点"/>
官翻：计算key.hashCode（）并将通过抑或将高位散列扩展到低位。因为表使用两个掩蔽的能力，所以仅在当前掩蔽之上的位上变化的散列集总是会发生冲突。（在已知的例子中，有一组浮点键在小表中保存连续的整数）因此我们应用了一种转换，将高位的影响向下传播。比特扩展的速度、实用性和质量之间存在权衡。因为许多常见的散列集已经被合理地分配了（所以不受益于扩展），而且由于我们使用树来处理容器中的大量冲突，我们只是以最便宜的方式异或一些移位的位来减少系统损失，以及合并由于表边界而在索引计算中永远不会使用的最高位的影响。
这段代码被称为`扰动函数`，通过`hashCode`的高16位与第低16位进行异或运算达到对hash的扰动，使hash可以更合理的被使用。
```java
/**
 * Computes key.hashCode() and spreads (XORs) higher bits of hash
 * to lower.  Because the table uses power-of-two masking, sets of
 * hashes that vary only in bits above the current mask will
 * always collide. (Among known examples are sets of Float keys
 * holding consecutive whole numbers in small tables.)  So we
 * apply a transform that spreads the impact of higher bits
 * downward. There is a tradeoff between speed, utility, and
 * quality of bit-spreading. Because many common sets of hashes
 * are already reasonably distributed (so don't benefit from
 * spreading), and because we use trees to handle large sets of
 * collisions in bins, we just XOR some shifted bits in the
 * cheapest possible way to reduce systematic lossage, as well as
 * to incorporate impact of the highest bits that would otherwise
 * never be used in index calculations because of table bounds.
 */
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
右位移16位，正好是32bit的一半，自己的高半区和低半区做异或，就是为了混合原始哈希码的高位和低位，以此来加大低位的随机性。而且混合后的低位掺杂了高位的部分特征，这样高位的信息也被变相保留下来。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdt829h17bj30ga09cjs5.jpg)

### 保留方法
为了继承自HashMap的LinkedMap保留的方法
```java
// Callbacks to allow LinkedHashMap post-actions
void afterNodeAccess(Node<K,V> p) { }
void afterNodeInsertion(boolean evict) { }
void afterNodeRemoval(Node<K,V> p) { }
```
LinkedHashMap中被覆盖的afterNodeInsertion方法，用来回调移除最早放入Map的对象

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
    LinkedHashMap.Entry<K,V> first;
    if (evict && (first = head) != null && removeEldestEntry(first)) {
        K key = first.key;
        removeNode(hash(key), key, null, false, true);
    }
}
```

## put流程  <Badge text="重点"/>

### put()
官翻：将指定的键值关联放到map中，如果瓷当前map已经含有相同的key，旧的值会被覆盖。返回key对应的上一个value的值，如果没有对应关系返回空。
```java
/**
 * Associates the specified value with the specified key in this map.
 * If the map previously contained a mapping for the key, the old
 * value is replaced.
 *
 * @param key key with which the specified value is to be associated
 * @param value value to be associated with the specified key
 * @return the previous value associated with <tt>key</tt>, or
 *         <tt>null</tt> if there was no mapping for <tt>key</tt>.
 *         (A <tt>null</tt> return can also indicate that the map
 *         previously associated <tt>null</tt> with <tt>key</tt>.)
 */
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```  

### putVal()
```java
/**
 * Implements Map.put and related methods.
 *
 * @param hash hash for key
 * @param key the key
 * @param value the value to put
 * @param onlyIfAbsent if true, don't change existing value
 * @param evict if false, the table is in creation mode.
 * @return previous value, or null if none
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

1. 第14行
如果当前的对象数组为空时，执行resize方法，对数组进行初始化
```java
if ((tab = table) == null || (n = tab.length) == 0)
    n = (tab = resize()).length;
```

2. 第16行
以`i = (n - 1) & hash`作为数组下标，如果此下标下对象为空，新建一个`Node`对象填到此处

```java
if ((p = tab[i = (n - 1) & hash]) == null)
    tab[i] = newNode(hash, key, value, null);
```

:::tip 精华

n = tab.length 或 n = (tab = resize()).length; 为当前table的容量，一定是2的n次幂    
n - 1 的二进制一定为全1，比n的少一位    
此时执行 (n - 1) & hash，相当于对hash进行了模n的操作    

:::

3.1 第20行
当前下标位置的对象p的hash与即将put的对象的hash一致，并且（两者的key相等或者两者的key equals为真），将当前对象暂存给e
```java
if (p.hash == hash &&
        ((k = p.key) == key || (key != null && key.equals(k))))
        e = p;
```

3.2 第23行
当前下标位置的对象p是`TreeNode`类型，说明当前节点是一棵红黑树，执行`putTreeVal`方法
```java
else if (p instanceof TreeNode) {
        e = ((TreeNode<K, V>) p).putTreeVal(this, tab, hash, key, value);
    }
```

3.3 第25行
遍历单链表，当某个节点的next指向为空时，将待插入节点链到此处（`尾插法`）；当找到（两者的key相等或者两者的key equals为真）的节点时，跳出本次循环
添加元素后，如果当前链表长度（除去头结点）大于等于`TREEIFY_THRESHOLD - 1 = 7`时，单链表转红黑树
```java
 else {
        for (int binCount = 0; ; ++binCount) {
            if ((e = p.next) == null) {
                p.next = newNode(hash, key, value, null);
                if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                    treeifyBin(tab, hash);
                break;
            }
            if (e.hash == hash &&
                ((k = e.key) == key || (key != null && key.equals(k))))
                break;
            p = e;
        }
    }
```

3.4 第39行
如果e不为空，代表map中存在相同的key。将e的值暂存，如果是否允许覆盖，或者value为空，将新值赋值，旧值返回
```java
if (e != null) { // existing mapping for key
        V oldValue = e.value;
        if (!onlyIfAbsent || oldValue == null)
            e.value = value;
        afterNodeAccess(e);
        return oldValue;
    }
```

3.5 第47行
修改操作数；如果当前map的容量大于扩容阈值，进行resize扩容；回调以允许LinkedHashMap后置操作；返回null
```java
++modCount;
if (++size > threshold)
    resize();
afterNodeInsertion(evict);
return null;
```

### resize()
官翻：初始化或者将表扩大为原来的两倍。如果为空，则分配与初始容量目标保持一致的空间。否则，因为容器的个数为2的整数次幂，所以bin中的每一个元素可能在同一下标索引，或者偏移2的整数次幂。

1.1 判断原有数组长度是否大于0，成立条件下判断原有数组长度是否大于map规定最大长度`MAXIMUM_CAPACITY`，如果大于限定长度最大值，`threshold`设置为`Integer.MAX_VALUE`，本次不进行扩容

1.2 判断原有数组长度是否大于map规定最大长度`MAXIMUM_CAPACITY`，将`oldCap`扩大两倍，同时，将扩容阈值 `threshold`扩大两倍

1.3 通过构造函数指定初始数量大小后，会将`table.length`计算为一个大于等于指定大小的2的整数次幂，此时以此作为map初始容量大小

1.4 所有条件都没有通过，使用默认值。此时的扩容阈值为加载因子乘以默认初始容量

2. 当`newThr == 0`成立，重新计算新的扩容阈值，并强制类型转换为整形

3. 将`newThr`赋值为`threshold`

4.根据新的数组容量新建一个数组`newTab`，并赋值给`table`

5. 原有数组为空的话，初始化操作已经完成。原有数组不为空，原有数组需要在新的数组空间上重新分配位置

5.1 原有数组元素可能为`null`、`Node`、`TreeNode`三种

5.2 如果遍历到下标`i`的元素不为`null`，将原有数组元素置为null(猜想：GC)

5.3 如果下标为`i`的元素的`next`指针指向空，代表该节点只有这一个元素，与`putval`操作一致，通过取余获得原有数组元素在新数组中的下标`newTab[e.hash & (newCap - 1)]`并赋值

5.4 如果元素类型为`TreeNode`执行`split`

5.5 如果下标为`i`的元素形成了单向链表，重新确定index的时候用的是`(e.hash & oldCap-1)`，是取模取余，而这里用到的是`(e.hash & oldCap)`，它有两种结果，一个是0，一个是oldCap，比如oldCap=8,hash是3，11，19，27时，(e.hash & oldCap)的结果是0，8，0，8，这样3，19组成新的链表，index为3；而11，27组成新的链表，新分配的index为3+8；

```java
/**
 * Initializes or doubles table size.  If null, allocates in
 * accord with initial capacity target held in field threshold.
 * Otherwise, because we are using power-of-two expansion, the
 * elements from each bin must either stay at same index, or move
 * with a power of two offset in the new table.
 *
 * @return the table
 */
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

:::warning 

链表与红黑树的转换以及红黑树的自身维护 暂时不做描述（还没弄明白）

:::
## jdk1.8新增方法
在1.8版本中也提供了许多新方法，实现都不难理解，此处只演示使用
```java
/**
 * 测试HashMap1.8新特性
 */
@Test
public void test5() {
    Map<Integer, String> map = new HashMap8<>();
    map.put(1, "jack");
    map.put(2, "tom");
    map.put(3, "wawa");

    String value = map.getOrDefault(4, "null");
    System.out.println(value);  // null
    //如果不用默认方法，自己就要写if...else判断了
//        String s = map.get(5);
//        if (s == null) {
//
//        } else {
//
//        }

    //put方法：如果key存在时，就替换值为新的值
    String v1 = map.put(3, "haha");
    System.out.println(v1);

    //putIfAbsent方法:如果key存在就不替换值，如果key不存在就新存入
    String v = map.putIfAbsent(3, "wangwang");
    System.out.println(v);
    map.forEach((key, va) -> System.out.println(key + "->" + va));
//        1->jack
//        2->tom
//        3->haha

    //remove方法:根据key和value都匹配时，才会真正删除
    map.remove(1, "vince");
    System.out.println(map.remove(1, "vince")); // false

    //replace(key,V,V)
    map.replace(1, "vince");        //直接替换成vince
    map.replace(1, "vince", "lala");//将vince替换成lala

    //compute方法：计算指定键的映射及其当前映射的值（如果没有当前映射， null ）
    map.compute(1, (k, va) -> va + "2"); //这里compute传入的是BiFunction方法，该BiFunction方法需要传入两个参数，所以lambda表达式需要两个参数
    map.forEach((key, val) -> System.out.println(key + "->" + val));
    /**
     1->lala2
     2->tom
     3->haha
     */

    //computeIfAbsent方法：如果key=4的值为空，才进行后面的计算
    map.computeIfAbsent(4, (k) -> k + "3"); //这里computeIfAbsent传入的是Function方法，该Function方法需要传入一个参数，所以lambda表达式需要一个参数
    //这里：k+"3"  就是  apply(T t)的方法的具体实现，因为接口里没有实现apply方法，所以这里是自定义要实现apply的方法
    map.forEach((key, val) -> System.out.println(key + "->" + val));
    /**
     1->lala2
     2->tom
     3->haha
     4->43
     */

    //computeIfPresent方法：如果key=4的值不为空，才进行后面的计算
    map.computeIfPresent(4, (k, v3) -> v3 + "pp");
    map.forEach((key, val) -> System.out.println(key + "->" + val));
    /**
     1->lala2
     2->tom
     3->haha
     4->43pp
     */

    //merge方法：合并
    map.merge(1, "1", String::concat);
    map.merge(8, "888", String::concat);
    map.forEach((key, val) -> System.out.println(key + "->" + val));
//        1->lala21
//        2->tom
//        3->haha
//        4->43pp
//        8->888
}
```
## 其他方法

### containsKey() 
查找map中是否含有指定的key，根据key的hash值计算出在map总对应节点的下标，根据下标的类型是`单Node`、`Node链表`、`TreeNode`来执行不同的查找方式，判断返回值是否为空

### remove() 
remove与put过程相反，根据key的hash值计算出在map总对应节点的下标，根据下标的类型是`单Node`、`Node链表`、`TreeNode`来执行不同的移除元素操作，如果原有数据节点类型为红黑树，在满足一定条件时时红黑树转链表（[测试](/views/back-end/java/base/HashMap.html#%E6%B5%8B%E8%AF%95)中有提及）

## 测试

在源码基础上添加控制台输出，便于观察执行流程，具体步骤略

在之前被适当删除的注释中表明，理想情况下使用随机的哈希码，容器中节点分布在hash桶中的频率遵循泊松分布，按照泊松分布的计算公式计算出了桶中元素个数和概率的对照表，可以看到链表中元素个数为8时的概率已经非常小
```
0: 0.60653066
1: 0.30326533
2: 0.07581633
3: 0.01263606
4: 0.00157952
5: 0.00015795
6: 0.00001316
7: 0.00000094
8: 0.00000006
more: less than 1 in ten million
```
所以将转红黑树的阈值设置为8.

### 定义对象
声明一个对象，重写`hashCode`方法
```java
package entity;

public class FakeHash {

    private int value;

    public FakeHash(int value) {
        this.value = value;
    }

    @Override
    public int hashCode() {
        return this.value & 7;
    }

    public int getValue() {
        return value;
    }
}
```
:::tip 偷鸡

为了让key尽可能的发生碰撞，在map中过早的形成链表，此处将hash的生成范围设置为`0~7`
此处`&7`相当于`%8` 

:::

### 编写打印函数
将`HashMap8`的成员变量公开并且生成 `get`方法

打印红黑树，递归，先输入右节点，再输出左节点，黑色节点使用`()`包围
```java
public <K, V> void printRedBlackTree(HashMap8.TreeNode<K, V> treeNode){
    System.out.println("---------------RedBlackTree----------------------------");
    printNode(treeNode, 0);
    System.out.println("---------------RedBlackTree----------------------------");
}

private <K,V> void printNode(HashMap8.TreeNode<K,V> root, int level) {
    if (root == null) {
        System.out.print(String.join("", Collections.nCopies( level, "\t")));
        System.out.println("NIL");
    } else {
        printNode(root.getRight(), level + 1);
        System.out.print(String.join("", Collections.nCopies( level, "\t")));
        if (root.isRed()) {
            System.out.printf("%d\n", root.getKey().hashCode());

        } else
            System.out.printf("(%d)\n", root.getKey().hashCode());
        printNode(root.getLeft(), level + 1);
    }
}
```

打印单链表，递归
```java
public void printNode(HashMap8.Node node){
    System.out.print(node.getValue());
    if (node.getNext() != null) {
        System.out.print("->");
        printNode(node.getNext());
    }
}
```

打印map
```java
public <K, V> void printMap(HashMap8<K, V> map){
    System.out.println("---------------Map----------------------------");
    for (int i = 0; i < map.table.length; i++) {
        HashMap8.Node<K, V> node = map.table[i];
        if(node != null) {
            System.out.print("当前元素下标为：" + i + " ,值为：" + node.getValue());
            if (node instanceof HashMap8.TreeNode) {
                System.out.println(" ,数据类型为红黑树");
                printRedBlackTree((HashMap8.TreeNode<K, V>) node);
            } else {
                System.out.println(" ,数据类型为单链表");
                printNode(node);
                System.out.println();
            }
        }
    }
    System.out.println("---------------Map----------------------------");
    System.out.println();
}
```

### 编写测试用例
put: 因为hash只会在`0~7`之间生成，对应到map中也是下标为`0~7`的元素，单链表转红黑树节点的个数阈值为8个，至少需要 `8 * 8 + 1=65`个节点；    
remove: 将key值保留到list中，通过打乱顺序，模拟随机删除
```java
@Test
public void test6(){
    HashMap8<FakeHash, Integer> map = new HashMap8<>();
    List<FakeHash> list = new ArrayList<>();
    FakeHash fakeHash;
    for (int i = 0; i < 65; i++) {
        fakeHash = new FakeHash(i);
        list.add(fakeHash);
        map.put(fakeHash, i);
        printMap(map);
    }

    // 将list打乱顺序 模拟随机删除
    Collections.shuffle(list);
    for (FakeHash hash : list) {
        System.out.println(String.format("移除【%d】hashCode=【%d】", hash.getValue(), hash.hashCode()));
        map.remove(hash);
        printMap(map);
    }
}
```

### 运行
1. 未指定map容量大小，使用默认值对table初始化，此时table对象未初始化
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gduxjk9hv7j30ne01omxb.jpg)
2. put 8个元素后，table[0...7]均有一个节点
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduvtxnp2bj30kg0k4q59.jpg)
3. 继续put产生hash碰撞，构成单链表
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduvuqx91bj30lk0kmtb9.jpg)
4. 元素个数达到12（默认初始容量16乘以默认加载因子0.75）时，数组扩容，扩容后数组大小为32，原数组元素重新放到新数组中
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduvvep6mnj30oc0isad8.jpg)
:::warning 提示
因为模拟的hash冲突产生的原因是hash完全一致，oldTab[0~7]映射到newTab的数组下标也为[0~7]
:::
5. 元素个数达到24（容量32乘以默认加载因子0.75）时，数组第二次扩容，扩容后数组大小为64，原数组元素重新放到新数组中，此时到达`MIN_TREEIFY_CAPACITY=64`，此后如果一个链表的长度超过8个，单链表会转为红黑树
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduw2bz056j30lw0lsn0k.jpg)
6. put 64个元素后，table[0...7]均有一个单链表，元素个数均为8个
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduvzs08e8j30kc0kgwhm.jpg)
7. 继续put元素，下标为0的元素个数大于`树化负载因子：8`，链表转红黑树
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduw1q3izqj30r614otd5.jpg)
8. `Collections.shuffle(list);`打乱key的顺序，模拟随机删除
9. 移除`value=47,hash=7`的元素，移除的元素为单链表中的非头结点，将`next`指针指向前一个对象
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduw61ovj3j30rk14edk2.jpg)
10. 移除`value=7,hash=7`的元素，移除的元素为单链表的头结点，将`next`指针`table[7]`
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduw83z5zaj30nw14642m.jpg)
11. 移除`value=64,hash=0`的元素，移除的元素为红黑树中的节点，由于满足jdk判断红黑树过小的条件，红黑树转链表
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduwb38sn8j30mq0kcq5q.jpg)
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduwdz2auej30u00w0grq.jpg)
12.最终移除所有节点，map为空
![](https://tva1.sinaimg.cn/large/007S8ZIlly1gduwesmecxj30kg0cgq40.jpg)

## 总结
:::tip

花了三个晚上的时间跟了这个代码，总算是对HashMap有了个整体认识。

理解hashmap里边的方法，就算什么也没看懂也会记得 `n & (2^m - 1) == n % 2 ^ m` :relieved:

[项目传送门](https://github.com/rookieHcy/rookie/tree/master/hashmap)

:::

