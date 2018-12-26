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

    router设定
        wepy相比vue，其router的自定义化被削弱。
        路由配置写在根组件app.wpy中。
            export default class extends wepy.app {
                config = {
                    pages:[
                        'pages/index',
                        'pages/hello'
                    ],
                    window:{
                        backgroundTextStyle:'light',
                        navigationBarBackgroundColor:'#fff',
                        navigationBarTitleText:'WeChat',
                        navigationBarTextStyle:'black'
                    }
                }
            }

    生命周期
        wepy总共有三种组件类型
            小程序入口 app.wpy，定义：
                export default class extends wepy.app{  }

            页面入口 page.wpy，定义：
                export default class PageName extends wepy.page{   }

            组件 com.wpy，定义：
                export default class ComponentName extends wepy.component {  }

            
        （1）app.wpy
            小程序的入口文件只有一个，就是app.wpy
            export default class extends wepy.app {
                config = {
                    pages:[

                    ],
                    window:{

                    }
                }
                constructor(){
                    super();
                    this.use("requestfix");
                }
                onLaunch(){

                }

                //其他的自定义方法、自定义变量都可在此定义，全局可用。
                //页面访问到该对象，使用this.$parent
                //组件访问到该对象，使用wepy.$instance
            }

        （2）page.wpy
            每一个页面都需要注册到app.wpy中config的page属性中，不注册将没有效果。
            export default class Page_1 extends wepy.page {
                data = {
                    //当前组件使用的状态
                }
                components = {
                    //引用组件
                }
                
                //继承属性
                mixins = [ mixin_JS_file ]
                
                //计算属性
                computed = {
                    a(){
                        return "b"
                    }
                }
                //监听器
                watch = {
                    num(newValue,oldValue){
                        //num和data中的num需要同名，当num改变时，触发该函数
                    }
                }
                
                methods = {
                    //默认wxml事件触发后，执行的回调函数
                }
                
                events = {
                    //$emit、$broadcast、$invoke触发后的执行事件
                }

                onLoad(){
                    //组件和页面都已经加载后的回调函数
                }
                onShow(){
                    //页面显示后的回调函数，此时组件不一定加载
                }
            }

        （3）com.wpy
            组件由页面进行引用，与页面不同的是，组件不需要写入app.wpy。
            但是需要引入到page.wpy，在components中指定。

            export default class Com extends wepy.component {
                components = {}

                data = {}

                methods = {}
                events = {}
            }

#   wepy数据传输
    
    1、组件通信
        wepy虽然基于Vue，但是wepy的状态管理暂时没有vuex的实现，仅有redux的实现；
        其实用redux也行，只不过过程比vuex繁琐些。
        （1）、父 ——> 子
        （2）、子 ——> 父
        （3）、无直接关联组件A <——> 无直接关联组件B
        （4）、跨页面通信

    2、http请求
        wepy.request({})

#   wepy打包项目，自动切换url前缀

    1、定义配置文件
        src——config——index.js
                    ——dev.js
                    ——prod.js

        index.js
            import devConf from "./dev";
            import prodConf from "./prod";
            import {merge} from "lodash";

            let config = {}; //配置文件对象，它将会被devConf或prodConf替换

            let env = __NODE_ENV__;// 当前的项目环境

            if(env === 'dev'){
              merge(config,devConf);
            }else if(env === 'production'){
              merge(config,prodConf);
            }

            export default config;

        dev.js
            //定义dev环境下，需要用到的配置数据即可
            export default {
                url:"http://127.0.0.1:8666"
            }
        
        prod.js
            //定义prod环境下，需要用到的配置数据即可
            export default {
                url:"http://127.0.0.1:8123"
            }

    2、修改打包规则
        wepy.config.js
            在这里需要新增plugin，定义全局变量值，打包时全局变量赋不同值

            compilers:{
                ...,
                babel:{
                    ...,
                    plugins:[
                        'transform-class-properties',
                        'transform-decorators-legacy',
                        'transform-object-rest-spread',
                        'transform-export-extensions',

                        //加入如下这段
                        ['global-define', {
                          __NODE_ENV__:process.env.NODE_ENV, //规定全局变量
                          __VERSION__:'1.0.0', //版本号
                          __TITLE__:'global-define' //说明
                        }]
                    ]
                }
            }

    3、定义命令
        package.json

            {
                ...,
                scripts:{
                    ...,
                    "dev":"cross-env NODE_ENV=dev wepy build --watch",
                    "prod":"cross-env NODE_ENV=production wepy build --no-cache"
                    ...,
                }
            }

    4、引用
        在页面中直接引入config中的index.js即可
        import __CONFIG__ from "../config/index.js";

        __CONFIG__.url即为dev.js或prod.js中的配置变量。








