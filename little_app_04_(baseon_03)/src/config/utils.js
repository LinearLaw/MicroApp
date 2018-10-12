
let utils = {
    //提示信息
    toast (_text,_icon){
        wx.showToast({
            title:_text || "",
            icon:_icon || "none",
            complete:()=>{
              setTimeout(()=>{
                wx.hideToast();
              },1500);
            }
        })
    },
    //查看pdf/doc/excel
    viewDocument(url){
        wx.downloadFile({
            url:  url,
            success: function (res) {
              var Path = res.tempFilePath;//返回的文件临时地址
              wx.openDocument({
                filePath: Path,
                success: function (res) {}
              })
            },
            fail: function (res) {
              console.log("fail",res);
            }
        })
    },
    setStorage(key,value,time){
      let t = time || 24*60*60*1000;
      let tempObj = {
        data:value,
        limitTime:new Date().getTime() + parseInt(t)
      }
      wx.setStorageSync(key,tempObj);
    },
    getStorage(key){
      let obj = wx.getStorageSync(key);
      if(obj){
        let temp = typeof obj == "string"?JSON.parse(obj):obj;
        if(temp.limitTime < new Date().getTime()){
          wx.removeStorageSync(key);
          return undefined;
        }else{
          return temp.data
        }
      }else{
        return undefined;
      }
    },
    /* 获取当前页面url */
    getCurrentPageUrlWithArgs() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const url = currentPage.route
      const options = currentPage.options
      let urlWithArgs = `/${url}?`
      for (let key in options) {
        const value = options[key]
        urlWithArgs += `${key}=${value}&`
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
      return urlWithArgs;
    },
    getParamFromUrl:function(url,name){
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var ar = url.split("?");
      var r = ar[ar.length-1].match(reg);
      if (r != null) return unescape(r[2]);return null;
    },
}
export default utils;
