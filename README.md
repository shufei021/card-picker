# picker-card
> 一种卡片式的联动选择器，旨在解决JS多级树结构展现方式，picker-card可以更多的层次结构数据展示和选择。

2020/3/8 第一版

2020/3/13 正式第一版发布

[体验地址:http://moxiaofei.com/picker-card/example/index.html](http://moxiaofei.com/picker-card/example/index.html)

第一次写js插件，难免疏忽大意，大佬莫怪

## 使用

script标签引入方式使用

```html
<body>
    <button id="btn">触发按钮</button>	
</body>    
<script src="picker-card.min.js"></script>
<script>
let list = [{text:'一级-1'.children:[{text:'二级-1-2'}]},{text:'一级-2'}]    
new PickerCard({
    trigger:'#btn',
    list:list,
    success:function(res,o) {
        //返回选择项  o对象是最后选择项的对象
        document.getElementById('btn').innerHTML = res
        console.log(o)
    }
})
</script>
```

## 参数配置

+ trigger：触发元素，值可以是DOM节点元素，也可以是选择器字符串
+ title：标题
+ list：注入的数据
+ isShowControl：是否显示操作按钮 默认是 false 不显示
+ success：选择完成后的回调