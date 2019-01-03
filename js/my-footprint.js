var nowDate = new Date();
var vm = new Vue({
    el:'#app',
    data:{
        printDate:nowDate.getFullYear() + '年' + (nowDate.getMonth() + 1) +'月'
    },
    methods:{

    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        //日期选择
        var dtPicker = new $.DtPicker({
            "type": "month",
            "beginYear": "2017",
            "endYear":new Date().getFullYear()
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