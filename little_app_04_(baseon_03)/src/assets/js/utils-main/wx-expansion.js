/**
 * wx api 的扩展
 * @function toast  调用wx.showToast接口，参数1为需要显示的文本，参数2为图标，显示后在1.5s后消失
 * @function viewDocument  传入pdf等文档的url，打开这个文档
 * @function setStorage 设置storage的值，传入key和value即可，默认过期时间24小时
 * @function getStorage 获取storage的值，传入key，有该值返回值，无该值返回undefined
 */

const wxExpansion = {
    //提示信息
    toast(_text, _icon) {
        wx.showToast({
            title: _text || "",
            icon: _icon || "none",
            complete: () => {
                setTimeout(() => {
                    wx.hideToast();
                }, 1500);
            }
        })
    },
    //查看pdf/doc/excel
    viewDocument(url) {
        wx.downloadFile({
            url: url,
            success: function(res) {
                var Path = res.tempFilePath; //返回的文件临时地址
                wx.openDocument({
                    filePath: Path,
                    success: function(res) {}
                })
            },
            fail: function(res) {
                console.log("fail", res);
            }
        })
    },
    //设置 storage
    setStorage(key, value, time) {
        let t = time || 24 * 60 * 60 * 1000;
        let tempObj = {
            data: value,
            limitTime: new Date().getTime() + parseInt(t)
        }
        wx.setStorageSync(key, tempObj);
    },
    //获取 storage ，若过期则消失
    getStorage(key) {
        let obj = wx.getStorageSync(key);
        if (obj) {
            let temp = typeof obj == "string" ? JSON.parse(obj) : obj;
            if (temp.limitTime < new Date().getTime()) {
                wx.removeStorageSync(key);
                return undefined;
            } else {
                return temp.data
            }
        } else {
            return undefined;
        }
    },
    chooseImage(count=1){
        return new Promise((resolve,reject)=>{
            wx.chooseImage({
                count: count,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    resolve(res);
                },
                fail(err){
                    reject(err)
                }
            })
        })
    }

}

module.exports = wxExpansion;
