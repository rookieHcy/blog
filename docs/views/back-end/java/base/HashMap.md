---
title: 一篇就够了 之 HashMap
date: 2020-04-13 21:33:26
tags:
 - Java
 - 基础
categories:
 -  后端
---


## 准备阶段
 + 复制`jdk源码`中的`AbstractMap``HashMap``LinkedHashMap`到新的路径下

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsi4y450yj30g206wmxl.jpg)

+ 类或者接口之间的依赖关系
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsibvzj4lj31c00u0jz2.jpg)

+ 修改`HashMap`为`HashMap8`
![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdsifsn1hxj30jk0bcmy3.jpg)

+ `HashMap`依赖于对象的`hash`值，此处声明一个对象，方便对`hash`的控制
```java
package entity;

public class FakeHash {

    private int val;
    
    private int hash;

    public FakeHash(int val, int hash) {
        this.val = val;
        this.hash = hash;
    }

    public FakeHash(int val) {
        this.val = val;
        this.hash = super.hashCode();
    }

    @Override
    public int hashCode() {
        return this.hash;
    }

    public int getVal() {
        return val;
    }

    public void setVal(int val) {
        this.val = val;
    }

    public int getHash() {
        return hash;
    }

    public void setHash(int hash) {
        this.hash = hash;
    }
}
```
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

3. 调用双参构造函数，参数为`初始容量` `加载因子`。当`初始容量`小于0时抛出异常；大于HashMap最大容量`1<<30`，复制容量为最大值；调用`tableSizeFor`方法。
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
[传送门 - 为什么要保证HashMap的容量为2的整数次幂]()

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
构造函数未指定加载因子时候的默认值0.75f。与
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
包含`hash哈希``key键``value值``next对象指针`，同时重写了`equals`方法和`toString`方法。
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

### resize
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

官翻：构造一个新的“HashMap”，它的映射与指定的“Map”映射相同。HashMap是用默认的load因子（0.75）和初始容量来创建的，它足以容纳指定的映射表中的映射。

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
官翻：
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

### 为了继承自HashMap的LinkedMap保留的方法
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
