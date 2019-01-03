var nowDate = new Date();
var vm = new Vue({
    el: '#app',
    data: {
        printDate: nowDate.getFullYear() + '年' + (nowDate.getMonth() + 1) + '月',
        //0:全部 1:支出 2:收入
        currentTab:0
    },
    methods: {

    }
});

(function ($, doc) {
    $.init();
    $.ready(function () {
        //日期选择
        var dtPicker = new $.DtPicker({
            "type": "month",
            "beginYear": "2017",
            "endYear": new Date().getFullYear()
        });
        var birthBtn = document.getElementById('footprint-date');
        birthBtn.addEventListener('tap', function () {
            dtPicker.show(function (selectItems) {
                vm.printDate = selectItems.y.text +
                    '年' + selectItems.m.text + '月';

            });
        });
    });

})(mui, document);

$(function() {
    $('li.tab-bar-item').click(function() {
        if(!$(this).hasClass('active')) {
            var index = Array.prototype.slice.call(document.querySelectorAll('li.tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.tab-content').eq(index).addClass('active');
            $('div.tab-content').eq(index).siblings().removeClass('active');
            vm.currentTab = this.dataset.type;
        }
    });
});