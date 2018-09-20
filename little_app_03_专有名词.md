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
	
```























