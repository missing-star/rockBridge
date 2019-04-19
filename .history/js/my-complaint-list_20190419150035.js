var page = 1;
var nowDate = new Date();
var vm = new Vue({
    el: '#app',
    data: {
        printDate: nowDate.getFullYear() + '年' + (nowDate.getMonth() + 1) + '月',
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        isMore: true,
        complaintList: [{
            "id":1,
            "user_id":8,
            "content":"我有事",
            "images":"http://dieshiqiao.pzhkj.cn/upload///2019-03-28/5c9c70eb6c9fa.jpg",
            "type":2,
            "status":2,
            "add_time":"2019-04-15",
            "update_time":"2019-04-15"
        }]
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
        this.complaintList.
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
                    vm.complaintList = [];
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
                vm.complaintList = vm.complaintList.concat(data.result);
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