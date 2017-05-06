var main = {};

(function ($) {
    var canClick = false;

    main.init = function () {
        //页面1加动画
        common.animate($(".page1").find(".ani"));

        main.initEvent();
    };

    main.initEvent = function () {
        //显示游戏规则
        $(".showRule").on("click", function () {
            $(".rule").fadeIn(500);
        });

        //关闭弹框
        $(".close").on("click", function () {
            $(this).parents(".tip").fadeOut(500);
        });

        //中奖信息1
        $(".img3_1").on("click", function () {
            if (canClick) {
                $(".winTip1").fadeIn(500);
            }
        });

        //中奖信息2
        $(".img3_2").on("click", function () {
            if (canClick) {
                $(".winTip2").fadeIn(500);
            }
        });

        //中奖信息3
        $(".img3_3").on("click", function () {
            if (canClick) {
                $(".winTip3").fadeIn(500);
            }
        });

        //切换到第2页
        $(".start").on("click", function () {
            var p1 = $(".page1");
            var p2 = $(".page2");

            $(".tip").fadeOut(500);

            p1.css("-webkit-animation", "fadeOut 1s");
            p2.show();

            setTimeout(function () {
                common.removeAni(p1.find(".ani"));
                p1.css("-webkit-animation", "none").hide();

                common.animate(p2.find(".ani"));

                //红包动画
                addAni();
            }, 700);
        });
    };

    /**
     * @desc 红包动画
     */
    function addAni() {
        setTimeout(function () {
            $(".img3_22").show();
            $(".img3_21").hide();
            $(".img3_24").show();

            setTimeout(function(){
                $(".img3_23").show().css("-webkit-animation", "ani14 1s");

                setTimeout(function () {
                    $(".img3_21").show();
                    $(".img3_22").hide();
                    $(".img3_24").hide();
                    $(".img3_23").hide();

                    setTimeout(function () {
                        $(".img3_1").css("-webkit-animation", "ani11 1.5s");
                        $(".img3_2").css("-webkit-animation", "ani12 1.5s");
                        $(".img3_3").css("-webkit-animation", "ani13 1.5s");

                        canClick = true;
                    }, 500)
                }, 1200);
            },500);
        }, 2000);
    }
})(jQuery);