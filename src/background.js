"use strict";
(function () {
    //读取透明度
    var opacity;
    chrome.storage.sync.get({
        opacity: '90',
    }, function (settings) {
        var opacity = settings.opacity;

        //标识是否登陆了
        var isLogined = document.querySelector(".user-name") !== null;

        //标识第几屏，注意baidu.com/s
        var page = (window.location.pathname === "/"
            || (window.location.pathname === "/s" && !window.location.search)) ? 1 : 2;

        //xhr
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", true);
        //https和http获得得图片url不同
        //http  得到 "url":"http://s.cn.bing.net/az/hprichbg/rb/PainshillParkGrotto_ZH-CN11107435187_1920x1080.jpg"
        //https 得到 "url":"/az/hprichbg/rb/PainshillParkGrotto_ZH-CN11107435187_1920x1080.jpg"
        //而且从http得到的图片url经常上不了，且从其他国家得到的却是https那种形式，所以统一用https

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var data = JSON.parse(this.response);

                //更改白色logo
                var imgs = document.querySelectorAll("#lg img, #result_logo img");
                for (var i = 0; i < imgs.length; i++) {
                    imgs[i].attributes["src"].value = "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/img/logo_white_ee663702.png";
                }

                //图片路径
                var imgUrl = "https://www.bing.com" + data.images[0].url;


                //提前缓存
                var tmpImg = new Image();
                tmpImg.src = imgUrl;
                tmpImg.onload = function () {
                    //设置背景方法
                    function setBackground(obj) {
                        //如果自定义了背景，就有background，所以用background
                        obj.style.cssText = "background:url(" + imgUrl + ") no-repeat !important; background-size:cover !important";
                    }

                    if (page === 1) {
                        //Copyright div
                        var divCopyright = document.createElement("div");
                        divCopyright.className = "s-bottom-ctner";
                        divCopyright.style.bottom = "16px";
                        divCopyright.innerText = data.images[0].copyright;

                        //如果登录了，背景设在.s-skin-container
                        if (isLogined) {
                            setBackground(document.querySelector(".s-skin-container"));

                            //首页web2.0半透明
                            head.className = "s-skin-hasbg white-logo s-opacity-" + opacity;
                            var link = document.createElement("link");
                            link.rel = "stylesheet";
                            link.href = "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/css/skin_opacity" + opacity + ".css";
                            document.querySelector("head").appendChild(link);


                            //第一屏跳到第二屏后，设置第二屏的背景
                            var observer = new MutationObserver(function () {
                                this.disconnect();
                                setBackground(head);
                            });
                            var wrapper = document.querySelector("#wrapper");
                            observer.observe(wrapper, {
                                "attributes": true,
                                "attributesFilter": ["class"],
                            });

                            //Copyright
                            document.querySelector("#s_wrap").appendChild(divCopyright);
                        }
                        else {
                            //未登录，背景设在#head
                            setBackground(head);

                            //Copyright
                            document.querySelector("#ftConw").insertBefore(divCopyright, document.querySelector("#cp"));

                        }
                    }
                    else
                        setBackground(head);
                }
            }
        };
        xhr.send();
    });
})();