#	小程序专有名词

## 	AppId

	微信公众号具备一个开发者ID，在公众号登录后，开发——基本配置——公众号开发信息处可以看到。
	
	小程序有一个小程序ID，在小程序登录后，设置——开发设置——开发者ID处可以看到。
	
	小程序开发时需要设置appId，调用各种接口名时需要用到，例如使用微信号授权登录。



##	AppSecret

	小程序密钥，登录公众平台小程序，可以生成密钥。
	
	和appId类似，小程序密钥可以令第三方拥有一些微信原生能力。



##  	需要说明的问题

```javascript
1、登录流程

	登录需要前端、后台、微信服务器三方交互。

2、授权

	调用一些原生能力需要用户进行授权，需要处理用户拒绝授权的情况。
	拒绝授权可以提示信息，发起重新授权的请求。

    eg：
        wx.authorize({
            scope:"scope.camera",//请求授权摄像头
            success:function(){

            },
            fail:function(){

            }
        });

	Tips：注意，获取用户信息的scope.userInfo在新版本中不具备直接获取的能力
		注意，wx.authorize如果被拒绝，将默认进入fail，
		wx.openSetting()可以显示被用户拒绝的权限，让用户打开。
        
3、调用原生能力
	小程序可以进行调取原生能力。
	先创建相机的上下文对象，再进行调取摄像头功能。
	
	eg：
        var ctx = wx.createCameraContext();
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            this.setData({
              src: res.tempImagePath
            })
          }
        })
	Tips：录制视频，需要scope.camera；
		录音，需要scope.record；

4、
	
```

## 调取摄像头

调取摄像头很特别。

	摄像头拍摄的界面，需要单独的一个页面进行。
	使用camera标签来标识摄像头拍摄到的图像的位置，在camera中无法插入其他的wxml元素。
    限制可以插入cover-view标签来显示基本的文字。
    slot不可使用。

		同时，拍照完成后，camera会继续采景。
	也就是说：
		1、进入到这个页面时，调取wx.createCamera创建摄像头对象，向用户申请授权摄像头的使用。
		2、若被用户拒绝，需要提示用户，重新发起请求。
		3、camera的拍摄按钮，独立于摄像头视野的范围之外
		4、拍摄成功后，需要跳转到一个独立的页面展示拍摄到的图片。
	



## 	常用API

```javascript
1、触发原生能力方式
	后续的更新中，微信将会逐渐废弃一些直接调用原生能力的方法，而推荐使用button实现。
    button加上open-type，后接需要调取的原生能力，然后绑定bind+原生能力名，
	回调函数即为返回值。
	
	（1）wx.getUserInfo()
		获取用户信息，请求授权
		<button open-type="getUserInfo" bindgetuserinfo="handler">打开授权</button>

		...
        handler: function(e){
            if (e.detail.authSetting["scope.userInfo"]){//如果授权了个人信息，就会为true
                
            }
        }
		...
        
	（2）wx.openSetting()
		打开授权界面，提示用户自己去授权
		<button open-type="openSetting" bindopensetting="handler">打开授权</button>

	
        handler: function(e){
            if (e.detail.authSetting["scope.camera"]){//如果有授权，就会为true
                this.setData({
                    showFlag: true
                })
            }  
        }
2、工具
	（1）重定向
   		关闭当前页面的跳转，不会进堆栈：
            wx.redirectTo({
                url:"", //page的url
                success:(res)=>{

                },
                fail:(res)=>{

                }
            })
		保留当前页面的跳转，会进堆栈：
        	wx.navigateTo({
                url:"", //page的url
                success:(res)=>{

                },
                fail:(res)=>{

                }
            })
		返回上一个页面
        	wx.navigateBack({
                delta:"", //返回的页面数，是个number，设置太大会返回到首页
                success:(res)=>{

                },
                fail:(res)=>{

                }
            })
        
        Tips：redirectTo和navigateTo可以配合使用，有些页面不需要用户再返回就可以考虑不进入堆栈。

	(2)界面工具
		模态框
            wx.showModal({
                title:"",
                content:"",
                showCancel:true, 
                success:function(){
                    
                },
                fail:function(){
                    
                }
            })
		提示框
            wx.showToast({
				title:""
            });

            wx.hideToast()
		
		加载提示
            wx.showLoading({
                title:"",
                mask:false,		//是否显示透明蒙层，防止触摸穿透
                success:function(){}
            })
			wx.hideLoading()

        Tips：界面工具，showToast的层级在video等原生组件层级之上。
            若直接以标签形式写入<toast>内容</toast>，然后用wx:if控制开关，也可行，
            但是这个toast标签的层级将会在video等原生组件的层级之下，注意。

        Tips：目前发现的可以标签化的方法有俩，
            一是<toast icon="success">提示的内容</toast>，其中，icon的值参考icon组件的type值；
            二是<loading>提示的内容</loading>；
            两者都可以用wx:if控制显示隐藏，但是都会比原生组件层级要低。

    （3）组件

        ①、<scroll-view scroll-y> </scroll-view>

            Tips：scroll-view将建立起一个可以滑动的视图。
                注意，直接css控制overflow:auto，页面也可以滑动，但是会有卡顿现象，
                换scroll-view将大大改善。

            

            Tips：常用的事件有
                bindscrolltolower：滚动到底部或最右的时候，触发；
                    可设置lower-threshold，规定在距离底部多远处触发事件，
                    eg：lower-threshold="100"

                bindscrolltoupper：滚动到顶部或最左的时候，触发；
                    可设置lower-threshold，规定在距离底部多远处触发事件，
                    eg：upper-threshold="100"

                bindscroll：滚动即触发。function里面带一个event对象。
                    event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
            
            Tips：关于滚动，scroll-view的竖向滚动，要求scroll-view本身带有height属性，100%就行。

        ②、<cover-view></cover-view>
            Tips：cover-view的层级在原生组件之上，即可覆盖map、video、camera。
            Tips：cover-view里面只支持放cover-view、cover-image和button。其他标签不支持。

        ③、<button></button>
            Tips：button的边框有点问题。
            Tips：button本体设置border:none，outline:none；
                除此之外！还要给button:after，设置border:none，即可完全去除边框。
            Tips：加入open-type属性，可令按钮拥有访问原生能力的权限。


```

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























