# WXML
    
    小程序界的html。

    基本页面标签
        1、视图容器

        （1）<view></view>
            ≈div，具备block属性

        （2）<scroll-view></scroll-view>
            可滚动视图容器

        （3）<swiper ></swiper>
            滑块视图容器

        2、基础内容
        （1）<text></text>
            ≈span，具备inline属性

        （2）<icon></icon>
            专有，图标

        （3）<progress></progress>
            专有，进度条容器

        3、多媒体内容
        （1）<image></image>
            ≈img，具有一系列私有属性
            mode="cover"
            src="xxx.jpg"
        
        （2）<video></video>
            ≈video，视频

        （3）<audio></audio>
            ≈video，音频

        4、导航
        （1）<navigator></navigator>
            ≈a，应用链接

        5、表单
            button
            form
            input
            checkbox    单选器
            radio   多选器
            picker  列表选择器
            picker-view     内嵌列表选择器
            slider  滚动选择器
            switch  开关选择器
            label   标签
        
        5、<block></block>
            一个包装元素，不会在页面中做任何渲染，但可以接受控制属性
            例如: <block wx:if={{true}}> <view>真香</view>  </block>

    模板标签
        1、<template></template>
            定义一段模板，这段标签用template包裹；
            name="msgItem"，定义了该段模板的名称为msgItem

            使用模板时，使用is来声明需要使用的模板，并将需要的数据导入
            <template is="msgItem" data="{{ ...item }}"  ></tempalte>

            Tips：进阶语法，对模板进行自动筛选
                <block wx:for="{{ [1,2,3,4,5,6,7] }}">
                    <template is="{{ item%2 == 0?"even":"odd" }}"></template>
                </block>

        2、<import />和<include />
        （1）、import可以对文件进行引用，并使用该文件内部定义的模板。

            eg：<import src="./item.wxml" />
                <template is="item" data="{{ text:"abc" }}" ></template>
        
            Tips：需要注意的是，A引用的模板B中如果定义了另一个模板C，可以引用该模板，
                但是A引用的模板B中如果引用了其他模板D，A就不能引用这个模板了。

        （2）、include与import不同，
            include引用的内容，
            可以将该文件除了<template />和<wxs />之外的整个代码都引入。
            引入的是直接的一个代码块。

            eg：
                <include src="header.wxml"></include>
                <view> WXML CONTENT HERE </view>
                <include src="footer.wxml"></include>

    事件绑定
        1、语法
            事件分为冒泡事件和不冒泡事件，
                冒泡事件用bind
                不冒泡事件用catch

            前缀定义是否冒泡（catch,bind），后缀定义事件类型
                用户事件类型：
                    tap、
                    touchstart、touchmove、touchcancel、touchend、
                    longpress、longtap
                动画事件类型：
                    transitionend、
                    animationstart、
                    animationiteration、
                    animationend、

                高级用户才会用到的事件
                    touchforcechange:3D touch，重按触发

        2、事件属性
            触发事件的函数会带有一个事件对象
            {
                type:"事件类型",
                timeStamp:"事件触发时时间戳",
                target:"触发事件组件的属性集合",
                currentTarget:"当前组件的属性值集合"
            }

    列表循环与逻辑判定
        1、wx:for
            <view wx:for="{{array}}">
                {{ index }}  {{ item.message }}  
            </view>

            循环下，默认的索引和变量名分别为 index item，
            通过  wx:for-index="_idx"
                  wx:for-item="_items"重定义

        2、wx:if
            <view wx:if="{{length > 5}}"> 1 </view>
            <view wx:elif="{{length > 2}}"> 2 </view>
            <view wx:else> 3 </view>

#   WXS

    小程序界的js。
    语法与js基本一致。


#   WXSS

    小程序界的CSS。
    语法与CSS基本一致。

    尺寸单位：
        rpx，会进行自适应的尺寸单位，750rpx = 375px

    样式导入
        @import "./list.wxss";

    app.wxss
        定义在app.wxss中的样式即为全局样式，其余为局部样式。
        局部样式只作用于当前页面。

#   微信原生能力

    1、登录
        wx.login({
            success(res){
                //res：{  errMsg:"调用结果说明", code:"用户登录凭证"  }
            },
            fail(err){ console.log(err); }
        })

        wx.login调用成功后，
        （1）code需要回传给开发者服务器，开发者服务器接收后，请求微信服务器；

        （2）微信服务器得到code的值，向开发者服务器返回openid和session_key；
            openid:用户唯一标识；session_key，会话密钥；

        （3）开发者服务器拿到了openid和session_key，最好不要将其作为signal回传给前端
            做法是：后端自己生成一个自定义的id字段，来与openid和session_key关联，
            全部存到后端服务器中，这个自定义的id回传给前端，
            前端则存到cookie或storage中。

        （4）之后前端请求后台接口时，都携带这个自定义的id值，
            后端可通过此来查询到该用户对应的openid和session_key

    2、获取用户信息
        <button open-type="getUserInfo"></button>
        需要主动引导
        wx.getUserInfo({
            withCredentials:true/false,//是否携带登录状态
            success(res){
                /** res:{
                    userInfo:{},   //用户信息对象，头像，昵称等
                    rawData:"{}",  //不包括敏感信息的原始数据字符串
                    signature:"",  //用户加密信息
                    encryptedData:"", //完整用户数据的加密后的字符串
                    iv:"" //加密算法的初始向量
                } */
            }
        })