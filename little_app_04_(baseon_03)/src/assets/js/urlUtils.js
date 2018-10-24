
/**
 * 关于url处理的工具
 * @function getCurrentPageUrlWithArgs  获取当前url
 * @function getParamFromUrl  传入url和name，返回在url中这个name对应的值
 * @function getUrlParam 传入url和name, 获取一段url中所有的key，以对象形式返回
 * @function makeUrlParams 传入对象，返回格式化后的字符串 {a:123,b:456} => ?a=123&b=456
 */


const urls = {
    /**
     * 小程序获取当前页面的url
     */
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
    /**
     * 传入一段url，一段name，返回这个name对应的值
     */
    getParamFromUrl: function(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var ar = url.split("?");
        var r = ar[ar.length - 1].match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    /**
     * 获取一段url中所有的key，以对象形式返回
     * @param {*} sUrl url
     * @param {*} sKey 指定的key
     */
    getUrlParam(sUrl, sKey) {
        var obj = {};
        var index = sUrl.indexOf('?');
        if (index == -1) {
            if (sKey == undefined) {
                return obj;
            } else {
                return "";
            }
        }
        var queryString = (sUrl.split("?")[1]).split("#")[0];
        var query = queryString.split('&'); //分离出了所有参数
        for (var i = 0; i < query.length; i++) {
            var keyValue = query[i].split("=");
            var key = keyValue[0];
            var value = keyValue[1];
            if (value == "") {
                continue;
            }
            if (obj.hasOwnProperty(key)) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    var val = obj[key];
                    obj[key] = [];
                    obj[key].push(val);
                    obj[key].push(value);
                }
            } else {
                obj[key] = value; //有新参数，直接添加
            }
        }
        if (sKey) {
            return obj[sKey] ? obj[sKey] : "";
        } else {
            return obj;
        }
    },
    /**
     * eg： {a:123,b:456} => ?a=123&b=456
     * @param {*} obj
     */
    makeUrlParams(obj) {
        let str = "?";
        Object.getOwnPropertyNames(obj).map(function(item, index) {
            str = str + item + "=" + obj[item] + "&";
        });
        return str.slice(0, -1);
    }
}

module.exports = urls;
