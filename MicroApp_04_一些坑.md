## 一些坑

    1、下拉加载与scroll-view冲突
        （1）使用scroll-view， 定义scrolltolower作为下拉到底部时触发的事件。

        （2）页面page中，config开启了 enablePullDownRefresh:true 时，
            scroll-view将会导致无法下拉，下拉无效果。

        （3）此时，将scroll-view改为view，解决。

        替代方案为：config的同级写入onReachBottom事件，下拉到底时，会自动触发。
        同时onPullDownRefresh作为下拉刷新事件，在该函数里面操作下拉刷新结束

    2、组件传值
    
        以下这种方式不被允许：
            <Modal :modalData="modalData.concelText"></Modal>

        替代方案为：
            <Modal :modalData="modalData"></Modal>

    3、循环生成的组件具备同一个实例

        <repeat for="{{repeatArr}}" key="index" index="index" item="item">
            <ContractManageItem :item.sync="item" :index="index" :tabControl="tabControl" ></ContractManageItem>
        </repeat>

        假如 ContractManageItem 组件，其data里面有一个变量叫isShow，初始值为false，
        注意，在循环生成的所有 ContractManageItem 中，这个isShow是公用的。

        这简直是神坑。
        替代方案为：在repeatArr数组的每一项，里面加入一个属性值名为isShow，
            每次组件内部需要改变isShow的值时，将当前组件对应的索引index，通过$emit到父组件，
            父组件再去改动repeatArr[index][isShow]的值。

            同时，整个循环体都放入到组件内部，而不将循环体外置到父组件。

    4、video组件内部的cover-view
        video里面可以使用cover-view组件，作为覆盖在视频上面的内容。
        内容使用margin会出现问题，

        假设有一个盒子，定位方式为position:absolute，里面有两个cover-view，
        设为A，B，两个都设置成inline-block。

        bug场景为：假如A设置一个margin-right:10px，B的右侧10px将会被切掉。
        解决方案为：以padding来做块级之间的间距，而不考虑使用margin.
                在IOS上面有此问题，安卓没有这个问题。

    5、视频录制的坑
        业务流程为：点击开始录制，小程序调起摄像头进行录像，录制完成后进行预览。

        （1）、录制视频用到了camera标签
            <camera class="record_main" device-position="front" flash="off" binderror="error"></camera>

            开局初始化camera对象，const ctx = wx.createCameraContext();

        （2）、接着随着用户点击按钮，来进行开始录制、停止录制。
            开始录制：ctx.startRecord({})
            停止录制：ctx.stopRecord({})

        注意点一：startRecord有自动停止时间，现在是2018年12月26日17:52:24，
            startRecord的自动停止时间为30s，
            30s到了之后，会触发timeoutCallback这个function。

        注意点二：当发生了录制超时后，ctx.stopRecord({})将直接报错。

        注意点三：如果在timeoutCallback触发的同时调用了ctx.stopRecord({})，
            也就是自动停止的同时点了一下停止录制的按钮，
            因为手速太快，也会报错。

            解决方案为：在stopRecord和timeoutCallback调用同一个函数，
                这个函数里面设置一个锁，
                当前的函数没有执行完的之前，不可再次触发本函数；

                eg：假设stopRecord和timeoutCallback触发的时候都会调用completeRecord，
                    let _this = this;
                    //设置一个指示器stopCtrl，锁住当前操作
                    if(_this.stopCtrl == true){
                        return;
                    }
                    _this.stopCtrl = true;
                    wx.showLoading({
                        title:"加载中...",
                        complete(){
                            //执行到最后，将stopCtrl放开
                            _this.stopCtrl = false;
                            wx.hideLoading();
                            wx.redirectTo({url:"");
                        }
                    });

    6、rich-text
        rich-text的性能是有问题的，当节点过多，小程序将会卡死。
        替代方案为：使用wxParse。
            其实wxParse也有坑，文档上面写的示例没有很大用处，甚至有误导。

        写法：
            <import src="./wxParse/wxParse.wxml"/>
            <template is="wxParse" data="{{wxParseData:htmlAry.nodes}}"></template>
            
            import WxParse from "./wxParse/html2json.js";
            let html = "<p>123213213</p>";
            let htmlAry={};
            htmlAry = WxParse.html2json(list, 'returnData');
            this.htmlAry = htmlAry;
            this.$apply();

