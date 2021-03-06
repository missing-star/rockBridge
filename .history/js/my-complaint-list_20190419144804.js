var page = 1;
var nowDate = new Date();
var vm = new Vue({
    el: '#app',
    data: {
        printDate: nowDate.getFullYear() + '年' + (nowDate.getMonth() + 1) + '月',
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        isMore: true,
        goodsList: []
    },
    methods: {
        goDetail(url,id) {
            mui.openWindow({
                url:`${url}?id=${id}`
            })
        }
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    mounted() {
        getMyComplaintList(this.year, this.month);
    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        //日期选择
        var dtPicker = new $.DtPicker({
            "type": "month",
            "beginYear": "2018",
            "endYear": new Date().getFullYear()
        });
        var birthBtn = document.getElementById('footprint-date');
        birthBtn.addEventListener('tap', function () {
            dtPicker.show(function (selectItems) {
                vm.printDate = selectItems.y.text +
                    '年' + selectItems.m.text + '月';
                    page = 1;
                    vm.goodsList = [];
                getMyComplaintList(selectItems.y.text,selectItems.m.text);
            });
        });
    });

})(mui, document);

$(function () {
    if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
        if (vm.isMore) {
            page += 1;
            getMyComplaintList(vm.year, vm.month);
        }
    }
});

function getMyComplaintList(year, month) {
    $.ajax({
        url: `${rootUrl}/index/api/getMyComplain`,
        type: 'post',
        dataType: 'json',
        data: {
            year: year,
            month: month,
            page: page
        },
        success: function (data) {
            if (data.status == 1) {
                vm.goodsList = vm.goodsList.concat(data.result);
            }
            else {
                mui.toast(data.msg);
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}