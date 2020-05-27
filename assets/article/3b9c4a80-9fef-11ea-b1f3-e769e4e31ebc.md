### 浅拷贝
```js
var obj = {
    name:'wsscat',
    age:0
}
var obj2 = obj;
obj2['c'] = 5;
console.log(obj);//Object {name: "wsscat", age: 0, c: 5}
console.log(obj2);////Object {name: "wsscat", age: 0, c:
```

### 深拷贝
---
#### 数组Array
>slice
``` javascript
var arr1 = [1, 2, 3, 4];
var arr2 = arr1.slice(0);
arr1.push(5);
console.log(arr1); //[ 1, 2, 3, 4, 5 ]
console.log(arr2); //[ 1, 2, 3, 4 ]
```

>concat
```javascript
var arr1 = [1, 2, 3, 4];
var arr2 = arr1.concat();
arr1.push(5);
console.log(arr1); //[ 1, 2, 3, 4, 5 ]
console.log(arr2); //[ 1, 2, 3, 4 ]

```

---

#### 对象Object
```javascript
function deepCopy(source) {
  var result = {};
  for (var key in source) {
    if (typeof source[key] === "object") {
      result[key] = {};
      result[key] = deepCopy(source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
var obj = {
  name: "wsscat",
  age: 0
};
var obj1 = deepCopy(obj);
obj.name = "autumns";
console.log(obj); //Object {name: "autumns", age: 0}
console.log(obj1); //Object {name: "wsscat", age: 0}
```

#### 实现对 ***对象*** 包括 ***数组*** 的深拷贝
```javascript
Object.prototype.deepCopy = function() {
  var result = {};
  for (var attr in this) {
    if (this.hasOwnProperty(attr)) {
      if (typeof this[attr] === "object") {
        if (Object.prototype.toString.call(this[attr]) === "object Array") {
          result[attr] = this[attr].concat();
        } else {
          result[attr] = this[attr].deepCopy();
        }
      } else {
        result[attr] = this[attr];
      }
    }
  }
  return result;
};
```