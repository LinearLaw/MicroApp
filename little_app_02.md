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
                原生:    <view wx:for="{{array}}">
                            {{ index }} {{ item.message }}
                        </view>

                wepy:    <repeat for="{{ array }}" key="_index" index="_index" item="_item">
                            <view> {{_index}} {{_item.message}}  </view>
                        </repeat>

    Mixin混合

        有点类似于js的继承，不过有所不同，它的继承是针对wepy文件和js文件进行的。
        
        mixin的文件：test.js

            export default class Test extends wepy.mixin{
                data={
                    abb:"123"
                };
                methods={
                    handleClick(){
                        console.log(555);
                    }
                }
            }

        组件中混入test.js中的变量和方法

            import Test from "./test.js";
            export default class Page_1 extends wepy.page{
                data={

                };
                mixins = [Test];
            }
        Tips：进行指定mixin后的wpy组件，将会具有test.js中定义的data数据
                如果组件中已经存在该名称，不会被覆盖，mixin的值无效。
            对于methods中的事件或者其他自定义的生命周期函数，两者将会共存，
                但是在执行方法时，组件内同名方法先执行，然后执行mixin的方法。

    数据绑定方式
        原生的数据绑定：
            this.setData({ 'title':'this is hello world' });
            在setData后，js变量值被改变，然后去更改视图中的显示值。
            如果多次使用setData，可能有性能问题。

        wepy方式：
            直接执行this.title = 'this is hello world'即可。
            每次函数执行完成后，wepy将会进行脏数据检查，来统一修改视图。
            但是注意，在函数有异步的情况下，你需要手动更新脏数据检查。
                handleClick(){
                    setTimeout(()=>{
                        this.title = "title album";
                        this.$apply();//执行脏数据检查
                    })
                }