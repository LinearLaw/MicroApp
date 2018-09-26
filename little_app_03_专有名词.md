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


```



















