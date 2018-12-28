
import HtmlToJson from '../wxParse/html2json.js';

module.exports = {
    /**
     * [33.66 → 33.6600]
     * number 需要转换的数字
     * length 保留小数点后多少位
     */
    parseRateNumber(number,length){
        let len = length?length:4;
        let numArr = (number+"").split(".");
        let st = "";
        let se = "";
        if(numArr[1]){
            se = numArr[1];
        }else{
            se = "";
        }
        while(true){
            if(se.length>=len){
                break;
            }else{
                se += "0";
            }
        }
        return `${numArr[0]}.${se.slice(0,len)}`;
    },
    /**
     * [19900000 → 19,900,000.00]
     */
    parseMoney(s){
        if (!(s)) {return 0.00;}
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
        var c = s.split(".")[0].split("").reverse();
        var e = s.split(".")[1];
        var t = "";
        for (var i = 0; i < c.length; i++) {
            t += c[i] + ((i + 1) % 3 == 0 && (i + 1) != c.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + e;
    },
    /**
     * [parseHtml description]
     * @param  {[type]} str [description]
     */
    parseHtml(str){
        let box = "";
        let transData = {};
        transData = HtmlToJson.html2json(str, box);
        transData.view = {};
        transData.view.imagePadding = 0;
        return transData;
    },

    formateDate(n) {
        let date = new Date(parseInt(n));
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let Ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return {
            year: Y,
            month: M,
            day: D,
            hour: H,
            minute: Mi,
            second: Ss
        };
    },

    /**
     * [formatePhone] 传入一串数字，隐藏中间四位
     */
    formatePhone(str) {
        if (typeof str != "string") {
            return;
        }
        let l = str.length;
        let left = str.slice(0, 3);
        let right = str.slice(l - 4, l - 1);
        return left + "****" + right;

    },
    /**
     * [formateAmountToChinese money转换成中文大写描述]
     * @param  {[Number]} money [description]
     */
    formateAmountToChinese(money) {
        if(typeof money == "string"){
            money = parseFloat(money);
        }
        if(isNaN(money)){
            throw new Error("money should be a number");
            return;
        }
        //汉字的数字
        const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        const cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        const cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        const cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        const cnInteger = '整';
        //整型完以后的单位
        const cnIntLast = '元';
        //最大处理的数字
        const maxNum = 999999999.9999;
        //金额整数部分
        let integerNum;
        //金额小数部分
        let decimalNum;
        //输出的中文金额字符串
        let chineseStr = '';
        //分离金额后用的数组，预定义
        let parts;
        if (money == '') {
            return '';
        }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    }
}
