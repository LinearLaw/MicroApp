/**
 * @func common.alert()
 * @desc 弹框组件
 * @param cfg
 * @param cfg.title {string} 弹框标题，默认为没有标题
 * @param cfg.content {string} 弹框内容
 * @param cfg.width {string} 弹框宽度
 * @param cfg.dialog {boolean} 是否是对话框，默认为否
 * @param cfg.ok {function} 点击确定的回调函数
 * @param cfg.okValue {string} 确定按钮的文字，默认为确定
 * @param cfg.cancel {function} 点击取消的回调函数
 * @param cfg.cancelValue {string} 取消按钮的文字，默认为取消
 * @param cfg.textAlign {string} 文字方向，默认为居中
 * @param cfg.mask {boolean} 是否有遮罩层，默认为没有
 * @param cfg.container {string} 弹框容器，默认为body
 * @param cfg.big {boolean} 是否为大弹框
 * @param cfg.skin {string} 弹框样式
 */
var dialog = function (cfg) {
    var self = this;
    //设置默认值
    self.title = cfg.title;
    self.content = cfg.content;
    self.ok = cfg.ok || function () {
        };
    self.okValue = cfg.okValue || "确定";
    self.cancel = cfg.cancel || function () {
        };
    self.cancelValue = cfg.cancelValue || "取消";
    self.dialog = cfg.dialog || false;
    self.textAlign = cfg.textAlign || "center";
    self.width = cfg.width || "60%";
    self.mask = cfg.mask || false;
    self.container = cfg.container || "body";
    self.big = cfg.big || false;
    self.skin = cfg.skin || "";

    self.init();
};

(function ($) {
    dialog.prototype.init = function () {
        var self = this;

        //生成随机ID
        self.id = Math.ceil(Math.random() * 1000000);

        self.createDialog();
        self.initEvent();
    };

    /**
     * @desc 创建html结构，并添加到页面中
     * @func dialog.createDialog()
     */
    dialog.prototype.createDialog = function () {
        var self = this;
        var con = "";

        var sDialog = {
            "position": "fixed",
            "width": "100%",
            "height": "100%",
            "top": "0",
            "left": "0",
            "-webkit-transition": "0.5s ease-out",
            "-moz-transition": "0.5s ease-out",
            "-o-transition": "0.5s ease-out",
            "transition": "0.5s ease-out",
            "z-index": "9999",
            opacity: 0
        };

        var sDialogBox = {
            "position": "absolute",
            "top": "40%",
            "left": "50%",
            "width": self.width,
            "background-color": "#fff",
            "border-radius": "10px",
            "overflow": "hidden",
            "-webkit-transform": "translate(-50%,-50%)",
            "-moz-transform": "translate(-50%,-50%)",
            "-ms-transform": "translate(-50%,-50%)",
            "-o-transform": "translate(-50%,-50%)",
            "transform": "translate(-50%,-50%)",
            "box-shadow": "3px 3px 10px #666"
        };

        var sDialogTitle = {
            "font-size": "14px",
            "line-height": "30px",
            "text-align": "center",
            "color": "#60a0ff"
        };

        var sDialogCon = {
            "font-size": "14px",
            "color": "#555",
            "padding": "20px",
            "line-height": "20px",
            "text-align": self.textAlign,
            "border-bottom": "1px solid #ccc",
            "word-break": "break-all",
            "word-wrap": "break-word",
            "position": "relative"
        };

        var sDialogBtn = {
            "height": "40px"
        };

        var btnCancel = {
            "width": "50%",
            "height": "40px",
            "border": "none",
            "background": "none",
            "font-size": "14px",
            "padding": "0",
            "outline": "none",
            "float": "left",
            "box-sizing": "border-box"
        };

        var btnConfirm = {
            "width": "50%",
            "height": "40px",
            "border": "none",
            "background": "none",
            "font-size": "14px",
            "padding": "0",
            "color": "#60a0ff",
            "outline": "none",
            "float": "left",
            "box-sizing": "border-box"
        };

        if (self.mask) {
            sDialog["background-color"] = "rgba(0, 0, 0, 0.5)";
        }

        if (self.big) {
            $.extend(sDialogBox, {
                "border-radius": "15px",
                "box-shadow": "5px 5px 16px #666"
            });
            $.extend(sDialogTitle, {
                "font-size": "24px",
                "line-height": "60px"
            });
            $.extend(sDialogCon, {
                "font-size": "24px",
                "padding": "30px",
                "line-height": "30px"
            });
            sDialogBtn.height = "80px";
            $.extend(btnCancel, {
                "font-size": "24px",
                "height": "80px"
            });
            $.extend(btnConfirm, {
                "font-size": "24px",
                "height": "80px"
            });
        }

        con = '<div class="dialog ' + self.skin + '" style="' + toString(sDialog) + '">' +
            '<div class="dialogBox" style="' + toString(sDialogBox) + '">';

        if (self.title) {
            con += '<div class="dialogTitle" style="' + toString(sDialogTitle) + '">' + self.title + '</div>'
        }

        con += '<div class="dialogCon" style="' + toString(sDialogCon) + '">' + self.content + '</div>';

        if (self.dialog) {
            con += '<div class="dialogBtn" style="' + toString(sDialogBtn) + '">' +
                '<button id="dCancel' + self.id + '" class="btnCancel" style="' + toString(btnCancel) + '">' + self.cancelValue + '</button>' +
                '<button id="dConfirm' + self.id + '" class="btnConfirm" style="' + toString(btnConfirm) + '">' + self.okValue + '</button>' +
                '</div></div></div>'
        } else {
            btnConfirm.width = "100%";
            con += '<div class="dialogBtn" style="' + toString(sDialogBtn) + '">' +
                '<button id="dConfirm' + self.id + '" class="btnConfirm" style="' + toString(btnConfirm) + '">' + self.okValue + '</button>' +
                '</div></div></div>'
        }

        //向页面添加弹框
        $(self.container).append(con);

        //延时添加过渡效果
        setTimeout(function () {
            $(".dialog").css("opacity", 1);
        }, 30);
    };

    /**
     * @desc 绑定弹框按钮事件
     * @func dialog.initEvent()
     */
    dialog.prototype.initEvent = function () {
        var self = this;
        //取消按钮事件
        $("#dCancel" + self.id).on("click", function () {
            var state = self.cancel();
            if (state !== false) {
                $(this).parents(".dialog").remove();
            }
        });

        //确定按钮事件
        $("#dConfirm" + self.id).on("click", function () {
            var state = self.ok();
            if (state !== false) {
                $(this).parents(".dialog").remove();
            }
        });
    };

    /**
     * @desc 将css json转成字符串
     * @param str {object} css
     * @returns {string}
     */
    function toString(str) {
        var s = "";
        for (var i in str) {
            s += i + ":" + str[i] + ";";
        }
        return s;
    }
})(Zepto);

module.exports = dialog;