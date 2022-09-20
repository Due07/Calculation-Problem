# Calculation-Problem
常见的工作计算函数 / 面试函数

## Calculation-Problem-1.md
   常见的工作计算函数/面试函数

## Decorator
```
   Decorator            装饰器    属性 -> 访问 -> 参数 -> 方法
   |
   ├── class            类装饰器
   |   └── drag          └──拖拽装饰器
   |
   ├── method           方法装饰器
   |   └── public        └── 公共装饰器
   │
   └── types.ts         定义类型
```

## QuillEditor
```
   // 富文本 + 裁剪
   (quill + vue-quill-editor) + cropper.js

   上传文件方向(不贴代码): 
      1. 调用存储数据库本地 ---> (如果面向用户, 很容易数据库就满了, 崩溃～～～ )
      2. 自行调用aws/oss/qiniu云服务, key什么的有前端存（不安全）
      3. (推荐) 后端存储key 等，前端负责常规获取接口，后端返回云服务的预地址, 进行存储

   更新问题点：
      1. 修复富文本黏贴图片时base64的问题

```