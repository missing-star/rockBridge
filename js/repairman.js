var page2 = page3 = page4 = 1;
var vm = new Vue({
    el: '#app',
    data: {
        //指派中
        assigning: {
            loadMore: true,
            list: []
        },
        inputMoney: '',
        //已完成
        finished: {
            loadMore: true,
            list: []
        },
        //已拒绝
        refused: {
            loadMore: true,
            list: []
        }
    },
    methods: {
        confirmRepair(id) {
            submitRepair(id,0);
        },
        settingMoney(id) {
            mui.prompt('请输入金额', '金额', function (e) {
                if(e.index == 1) {
                    var reg = /^\d+(\.\d{0,2})?$/;
                    var result = reg.test(e.value);
                    if(result) {
                        vm.inputMoney = e.value;
                        submitRepair(id,e.value);
                    }
                    else {
                        mui.toast('请输入正确的金额！');
                        return false;
                    }
                }
            });
        },
        getDetail(status, id, order_status) {
            //查看报修详情
            mui.openWindow({
                url: 'repair-detail.html?status=' + status + '&id=' + id + '&order_status=' + order_status
            })
        }
    }
});
$(function () {
    $('li.goods-tab-bar-item').click(function () {
        //切换tab页
        if (!$(this).hasClass('active')) {
            var index = Array.prototype.slice.call(document.querySelectorAll('li.goods-tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.goods-tab-content-item').eq(index).addClass('active');
            $('div.goods-tab-content-item').eq(index).siblings().removeClass('active');
            loadMore();
        }
    });
    //获得报修记录1 处理中 2 维修中 3拒绝维修 4 维修完成
    getRepairRecord(2, page2, true);
    getRepairRecord(3, page3, true);
    getRepairRecord(4, page4, true);
    loadMore();
});

function pageLink(url) {
    mui.openWindow({
        url: url
    });
};

function getRepairRecord(type, page, loadMore) {
    if (!loadMore) {
        return false;
    }
    $.ajax({
        // url: `${rootUrl}/index/api/getMyRepairRecord`,
        url:'http://result.eolinker.com/FfX1CPg128451982317c38a8fb685a6a6f8994747021e62?uri=/index/api/getMyRepairRecord',
        type: 'post',
        datType: 'json',
        data: {
            getMyRepairRecord: type,
            page: page
        },
        dataType: 'json',
        success: function (data) {
            var list = data.result;
            list.forEach(function (item, index) {
                if (item.repait_content_images.indexOf(',') != -1) {
                    list[index].repait_content_images = rootUrl + item.repait_content_images.substring(0, item.repait_content_images.indexOf(','));
                } else {
                    list[index].repait_content_images = rootUrl + item.repait_content_images;
                }
            });
            switch (parseInt(type)) {
                case 2:
                    vm.assigning.list = vm.assigning.list.concat(list);
                    break;
                case 4:
                    vm.finished.list = vm.finished.list.concat(list);
                    break;
                case 3:
                    vm.refused.list = vm.refused.list.concat(list);
            }
        },
        error: function () {

        }
    })
}

//滚动加载
function loadMore() {
    if (document.querySelector('.goods-tab-content-item.active .no-more').getBoundingClientRect().top < document.documentElement.clientHeight) {
        var type = document.querySelector('.goods-tab-content-item.active').dataset.type;
        var page = type == 2 ? ++page2 : (type == 3 ? ++page3 : ++page4);
        var loadMore = type == 2 ? vm.assigning.loadMore : (type == 3 ? vm.refused.loadMore : vm.finished.loadMore);
        getRepairRecord(type, page, loadMore);
    }
}
$('div.goods-tab-content-item').scroll(function () {
    loadMore();
});

function submitRepair(id,money) {
    $.ajax({
        // url: `${rootUrl}/index/api/getUpdateMoney`,
        url:'http://result.eolinker.com/FfX1CPg128451982317c38a8fb685a6a6f8994747021e62?uri=/index/api/getUpdateMoney',
        data: {
            id: id,
            money: money
        },
        type: 'post',
        datType: 'json',
        success: function (data) {
            console.log(data);
            if (data.status == 1) {
                mui.confirm('提交成功！', '', ['确定'], function (e) {
                    location.reload();
                });
            } else {
                mui.toast(data.msg);
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}