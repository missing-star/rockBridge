var nowDate = new Date();
var vm = new Vue({
    el: '#app',
    data: {
        paidList: [1],
        printDate: nowDate.getFullYear() + '年' + (nowDate.getMonth() + 1) + '月',
        currentTab: 0,
        categoryIdList:[],
        contentList:[],
        currentTab:''
    },
    methods: {
        getDetail(id) {
            mui.openWindow({
                url: 'pay-detail-detail.html?id='+id
            })
        },
        getInvoice() {
            //发票
            mui.openWindow({
                url: 'apply-invoice.html'
            })
        },
        switchTab(event,tabId) {
            if (!$(event.target).hasClass('active')) {
                var index = Array.prototype.slice.call(document.querySelectorAll('li.cost-category-item')).indexOf(event.target);
                $(event.target).addClass('active');
                $(event.target).siblings().removeClass('active');
                vm.currentTab = $(event.target).attr('data-type');
                $('div.history-pay-list').eq(index).addClass('active');
                $('div.history-pay-list').eq(index).siblings().removeClass('active');
                //请求数据
                var date = this.printDate.replace('年','-').replace('月','');
                getCostDetail(tabId,date);
            }
        }
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
                    var date = vm.printDate.replace('年','-').replace('月','');
                    getCostDetail(vm.currentTab,date);

            });
        });
    });
})(mui, document);


//费用类型列表
$.ajax({
    url: 'http://dieshiqiao.pzhkj.cn/index/api/getPayCate',
    dataType: 'json',
    type: 'post',
    success: function (data) {
        var list = [];
        for (key in data.result) {
            vm.categoryIdList.push({id:data.result[key].id,name:data.result[key].name});
        };
        vm.currentTab = vm.categoryIdList[0].id;
        var date = vm.printDate.replace('年','-').replace('月','');
        getCostDetail(vm.currentTab,date);
    },
    error: function () {
        mui.toast('服务器异常！');
    }

});

function getCostDetail(cateId,date) {
    $.ajax({
        url:`${rootUrl}/index/api/getMyPayCharge`,
        data:{
            cate_id:cateId,
            date:date
        },
        type:'post',
        dataType:'json',
        success:function(data) {
            vm.contentList = data.result;
        },
        error:function() {

        }
    })
}

$(function () {

    $(window).scroll(function () {
        if (document.querySelector('div.history-pay-list.active div.no-more').getBoundingClientRect().top < document.documentElement.clientHeight) {

        }
    });
});
