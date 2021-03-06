### 使用形式上的不同（有无使用new）

---

构造函数：使用`new`运算符初始化函数来新建一个对象。

普通函数：不使用`new`运算符的函数就是普通函数

##### 所以从使用形式上比较：一个函数是否被作为构造函数还是普通函数的区别就是是否使用new

```js
function Person(){
    ...
    ...
 }
 var p=new Person();
```

#### 构造函数

---

当使用`new`调用构造函数后会发生以下变化：

1. 创建一个空对象:  ` var p={} `

2. this变量指向对象p:  `Person.call(p)`

3. p继承构造函数的原型：`p.__proto__=Person.prototype`

4. 执行构造函数中的代码

### 构造函数和普通函数的区别：

1. 构造函数使用new关键字调用，普通函数不使用new。

```js
var p1 = new Person ();
var p2 = Person ();
```

2. **this** 关键字

+ 构造函数中 ***this*** 指向构造出来的新对象
+ 普通函数中 ***this*** 指向`window`全局对象

3. 构造函数默认不用返回`return`，普通函数一般有`return`返回值

>3.1 构造函数默认返回**this**，也就是新的实例对象
>
>3.2 普通函数没有 **return** 默认返回 **undefined**
>
>3.3 构造函数如果使用了 **return** ，返回值根据类型而有所不同
>
>>3.3.1 
>>如果返回的是五种基本数据类型 `String`，`Number`，`Boolean`，`Null`，`Undefined`，构造函数会忽略返回值，而返回 **this** 对象
>>
>>3.3.2 
>>如果 return 的是引用类型：`Array`，`Date`，`Object`，`Function`，`RegExp`，`Error`，不论构造函数还是普通函数都会返回 `return` 后的值。

4. 构造函数首字母建议大写；普通函数建议小写

