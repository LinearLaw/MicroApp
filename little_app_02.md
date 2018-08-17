#   框架

    wepy —— 腾讯团队出品
        https://tencent.github.io/wepy/
        https://github.com/Tencent/wepy

    mpVue —— 美团团队出品
        http://mpvue.com/
        https://github.com/Meituan-Dianping/mpvue
    
        都基于Vue，修改了Vue的complier和runtime，使之运行在小程序环境。

#   wepy

    wepy项目初始化

        首先，全局安装wepy命令行工具
            npm i wepy-cli -g

        接着，在开发目录中，生成项目模板（1.7.0版本之后）
            wepy init standard wepy_project_demo

            cd wepy_project_demo

        安装依赖
            npm i 

        开发环境启动
            wepy build --watch

    项目结构
        src文件夹为源码
        dist文件夹为打包后的小程序代码

    规范
        1、小程序的入口文件默认是app.wpy
            小程序的页面、组件文件名后缀均为.wpy
        2、变量定义应避免以 $ 开头，它将会与wepy的内部属性名相冲突。
        3、ES6随便搞（好评）。
        4、可进行Promise

        5、语法替换、区别
            (1)、bindtap="click"  ——> @tap="click"
                catchtap="click" ——> @tap.stop="click"

            (2)、capture-bind:tap="click"  ——> @tap.capture="click"
                capture-catch:tap="click" ——> @tap.capture.stop="click"

            (3)、事件传参使用新语法
                bindtap="click" data-index={{ a }} ——> @tap="click( {{ a }} )"

            (4)、循环的写法进行了更改
                原生  <view wx:for></view>