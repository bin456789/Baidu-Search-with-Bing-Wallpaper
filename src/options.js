"use strict";
(function () {
    var opacity = document.getElementById("opacity");

    //生成option
    function show_options() {
        for (var i = 0; i <= 100; i += 5) {
            opacity.options.add(new Option(i + "%", i));
        }
    }

    //保存配置
    function save_options() {
        var val = opacity.value;
        chrome.storage.sync.set({
            opacity: val,
        }, function () {
            var status = document.getElementById('status');
            status.textContent = "设置已保存。";
            setTimeout(function () {
                status.textContent = "";
            }, 1000);
        });
    }

    //读取配置
    function restore_options() {
        chrome.storage.sync.get({
            opacity: "90",
        }, function (settings) {
            opacity.value = settings.opacity;
        });
    }


    document.addEventListener("DOMContentLoaded", show_options, false);
    document.addEventListener("DOMContentLoaded", restore_options, false);
    document.getElementById("save").addEventListener("click", save_options, false);
})();