### 1.数组去重 

```javascript
//单组数组去重  var a=[1,1,2,3,4,5,5,5,6];
//1. 利用对象属性的唯一性 进行去重，然后用对象的方法获取里面的keys（属性）--->默认返回的是一个数组 
var ar={}; 
a.forEach((ele,index)=>{ ar[ele]=index});
var arr=Object.keys(ar);   

//2.ES6的  set()方法  Array.from利用数组方法把对象变成数组
var arr=new Set(a);
arr=Array.from(arr);

//上面两个方法对于多数组去重也是比较效率的,就不用双重for去循环对比了
//多重组数 也可以用冒泡 如果是考验你用冒泡是否熟悉的话
```

### 2. add(2,5);add(2)(5)

```javascript
function add(x,y){
    if(y){
        return x+y;
    }else{
        return function add(z){
            return x+z;
        }
    }
}
// 第二种
const a = (x, ...y) => {
    if (y.length) {
        const num = y.reduce((pre, cur) => pre+cur, 0);
        return x+num;
    } else{
        return (...z) => {
            const num = z.reduce((pre, cur) => pre+cur, 0);
            return x+num;
        }
    }
}
```

### 3.找出一个字符串里出现最多的字符

```javascript
var a = "aaassvvvffffewf";
    a = a.split("");  //a->["a", "a", "a", "s", "s", "v", "v", "v", "f", "f", "f", "f", "e", "w","f"]
    var aa = {};
    a.forEach(ele => {
        // hasOwnProperty 对象（自身）属性是否含有某个属性
        if (aa.hasOwnProperty(ele)) {
            aa[ele]++;
            return;
        } else {
            aa[ele] = 1;
        }
    });            // aa -->变成对象
    var max = 0;
    var maxName = '';
    for (var i in aa) {
        if (aa[i] > max) {
            max = aa[i];
            maxName = i;
        }
    }
    console.log('最多的字符：' + maxName, '次数为：' + max);
//目前我认为最简单的方法
```

### 4. 不使用JavaScript自带的排序函数，编写一个对数组的降序排序函数

```javascript
// 输入：[1,5,3,4,5]    输出： [1,3,4,5,5]
// 也可使用冒泡~
const handle = (arr) => {
    const map = [];
    arr.forEach(item => {
        let val;
        if (Reflect.has(map, item)) {
            val = map[item];
        }
        map[item] = [...(val || []), item];
    });
    return map.flat(Infinity)
}

// 冒泡
const pao = (arrs) => {
    const arr = [...arrs];
    for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                }
            }
        }
    return arr;
}
```



### 5. 实现一个函数，输入元素均为数字的数组，请你原地删除重复数字（不创建新数组），输出一个不包含重复数字的数组

```javascript
// 输入： 【1，1，2，3，4，4，5】 输出：【1，2，3，4，5，undefined， undefined】
const handle = (nums) => {
    const map = new Map();
    nums.forEach((item, index) => {
        if (map.has(item)) {
            nums.splice(index, 1, undefined);
        } else {
            map.set(item, true);
        };
    })
		nums.sort();
    console.log(nums);
}
```



### 6. 实现一个搜索函数函数findNode，查找下属结构数据中任一节点

```javascript
const root = {
  name: 'parent',
  children: [
    {name: 'A', children: []},
    {
      name: 'B',
      children: [
        {
          name: 'C',
          children: [
            {name: 'D', children: []},
          ],
        },
      ],
    },
  ],
};

const handle = (arr, name) => {
    if (Reflect.toString.call(arr).includes('Object')) arr = [arr]; 
    let val;
    for (let index = 0; index < arr.length; index++) {
        if (arr[index].name === name) {
            return val = arr[index];
        }
        // 深度优先
        if (arr[index].children.length) {
            return val = handle(arr[index].children, name);
        };
    };
    return val;
};
```

### 7. 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标

```javascript
// 牛客网
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 

function calcFun (arr, target) {
    const map = new Map();
    for (let index = 0; index < arr.length; index++) {
        const handleNum = +target - arr[index];
        if (map.has(handleNum)) {
            return [index, map.get(arr[index])];
        }
        map.set(arr[index], index);
    };
};

```

### 8. 求一个字符串在另一个字符串中出现的次数
```typescript
const a ='ab';
const b = 'abaspdjpabasdabasdabsafqweqrabapjpjabppijpfababababofi';
const handleValue = (originStr: string, searchStr: string) => {
    if (!originStr || !searchStr) return new Error(`参数缺少`);
    const searchArr = originStr.match(new RegExp(searchStr, 'g')); 
    return searchArr ? searchArr.length : null;
}

handleValue(b, a);
```

### 9. 树形结构转化关系数组

```javascript
const haha =[{
    id:1,
    list: [{
            id:11,
            list: [{
                id:111,
		list: [{
                  id: 1111,
                }],
            },{
                id:112,
            }],
        },{
            id:12,
            list: [{
                id: 121,
            },{
                id: 122,
            }],
        },
    ],
},{ id: 2 }];           ------------> 输出 [[1, 11, 111], [1, 11, 112], [1, 12, 121], [1, 12, 122], [2]]

function flatArr(arr, handleVal, idArr) {
    return arr.reduce((pre, cur) => {
        let handleArr = [...(idArr||[]), cur.id];
        
        if (Reflect.has(cur, handleVal)) {
            
            handleArr = cur[handleVal].reduce((itePre, iteCur) => {
                const idArrs = [...handleArr, iteCur.id];

                const curArr = iteCur[handleVal] ? this.flatArr(iteCur[handleVal], handleVal, idArrs) : [idArrs];
                
                return !itePre.length ? curArr : [...itePre, ...curArr];
            }, []);
        } else {
            handleArr = [handleArr];
        }
        
        return !pre.length ? [...handleArr] : [...pre, ...handleArr];
    }, [])
};
```

### 10. 树形数据拍平

```typescript
// 拍平数据
/**
 *
 * @param arr 数据
 * @param handleVal 选择的处理的属性
 * reduce + 递归
 */
  flatArr(arr: Array<Record<string, any> | string[]>, handleVal: string) {
      return arr.reduce((pre: any, cur: any) => {
          const curArr: any = cur[handleVal] ? this.flatArr(cur[handleVal], handleVal) : [];
          return !pre ? [cur, ...curArr] : [...pre, cur, ...curArr];
      }, []);
  }
```

### 11. 扁平数组转化树结构
<!-- 有问题 -->
```typescript
// 转化成cascader想要的数据
/**
 *
 * @param arr 数据
 * @param handleVal 选择的处理的属性
 * foreach + 递归
 */
const conversionArr = (arr: Array<Record<string, any> | string []>, handleVal: string) => {
    arr.forEach((item: any) => {
        item.label = item.name;
        item.value = item.id;
        if (item[handleVal]) {
            item.children = [...item[handleVal]];
        }
        if (item.children) this.conversionArr(item.children, handleVal);
        // delete item[handleVal];
    });
    return arr;
}
```

### 12. 深拷贝函数

```typescript
/*
 * 1. JSON.parse(JSON.stringify(obj)) 常用的深拷贝 方法
 *		缺陷： - obj 只能 string / number / boolean / Array / Object , 传递 undefined / null / symbol 报错
 *					- obj 下属性值 不能为 undefined / function / symbol , 被序列化后的属性 (key) 则被默认删除
 *					- obj 下属性值 Regxp / Error / new Date ，被序列化后值为空对象 {}
 *					- obj 下属性值 NaN / Infinity / -Infinity ，被序列化后值为null
 * 需求： 创建一个函数方法，使其满足JSON.parse(JSON.stringify(obj)) 的所有缺陷。
 */

type Ttarget = any[] | string | number | boolean | Object | undefined | null | symbol | Date | RegExp; 

const deepCopy = (target: Ttarget) => {
    const test = /^\[object +(\S*)\]$/;
    const regVal = Reflect.toString.call(target).replace(test, '$1');

    if (regVal === 'Object' || regVal === 'Array') {
        let result: Record<string, any> | any[] = regVal === 'Object'
            ? new Object
            : new Array;
        for (const key in (target as Object | any[])) {
            if (Reflect.has(target as Object | any[], key)) {
                result[key] = deepCopy((target as Record<string, any>)[key]);
            }
        }
        return result;
    }

    if (regVal === 'Date') return new Date(target as Date);

    if (regVal === 'RegExp') return new RegExp(target as RegExp);

    // string / boolean / number / undefined / null / symbol / NaN / Infinity / -Infinity
    return target;

};
```

### 13. 函数题

```typescript
    /**
     * 第一题 1. 输入num = 3 页面展示如下表格
     * 1 1 1 
     * 2 2 2
     * 3 3 3
     */

    const handlValue = (num: number) => {
    let arr = new Array(num).fill(0);
    arr = new Array(num).fill(arr);

    // const valueArr = arr.map((item, index) => (Math.ceil((index + 0.1) / 3)))
    const valueArr = arr.map((item, index) => {
            return new Array(item.length).fill(index + 1);
        })
        console.log(valueArr);
    }

    /**
     * 第二题 2. 输入num = 3 展示如下表格
     * 1 2 3
     * 6 5 4
     * 7 8 9
     * 输入 num = 4
     * 1 2 3 4
     * 8 7 6 5
     * 9 10 11 12
     * 16 15 14 13
     */

    const handlValueArr = (num: number) => {
        const arr = Array(num).fill(Array(num));

        const valueArr = arr.map((item, index) => {

            const returnArr = Array(num).fill(index + 1)
                .map((ite, iteIndex) => {
                    const superpositionNum = (index === 0 ? 0 : (item.length - 1) * index);
                    return (
                        ite + superpositionNum
                    ) + (index % 2 ? (item.length - iteIndex - 1) : iteIndex);
            });

            return returnArr;
        });

        console.log(valueArr);
    }
```
