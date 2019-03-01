var page1 = page2 = page3 = page4 = 1;
var vm = new Vue({
    el: '#app',
    data: {
        //预约
        reverseing: {
            loadMore: true,
            list: [],
            total: 0
        },
        //指派
        assigning: {
            loadMore: true,
            list: [],
            total: 0
        },
        //维修中
        fixing: {
            loadMore: true,
            list: [],
            total: 0
        },
        //已完成
        finished: {
            loadMore: true,
            list: [],
            total: 0
        },
    },
    methods: {
        goRepair() {
            mui.openWindow({
                url: 'reverse-repair.html'
            });
        },
        getDetail(id) {
            //查看报修详情
            mui.openWindow({
                url: 'repair-detail.html?id=' + id
            })
        },
        goPay(status, id, order_status) {
            //缴费
            mui.openWindow({
                url: 'online-pay.html?status=' + status + '&id=' + id + '&order_status=' + order_status
            });
        },
        cancelReverse(id) {

        },
        getCause(cause) {
            var msg = cause == null ? '无' : cause;
            mui.confirm(`${msg}`, '拒绝原因', ['确定'], function (e) {

            });
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
    //获得报修记录1--预约中  2--指派中  3--维修中 4,5,6维修完成(包括已取消的和已拒绝的)
    getRepairRecord('1', page1, true);
    getRepairRecord('2', page2, true);
    getRepairRecord('3', page3, true);
    getRepairRecord('4,5,6', page4, true);
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
        url: `${rootUrl}/index/api/getMyRepairRecord`,
        type: 'post',
        datType: 'json',
        data: {
            handle_status: type,
            page: page
        },
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                var list = data.result.list;
                list.forEach(function (item, index) {
                    if (item.repait_content_images.indexOf(',') != -1) {
                        list[index].repait_content_images = rootUrl + item.repait_content_images.substring(0, item.repait_content_images.indexOf(','));
                    } else {
                        list[index].repait_content_images = rootUrl + item.repait_content_images;
                    }
                });
                switch (type) {
                    case '1':
                        if (list.length == 0) {
                            vm.reverseing.loadMore = false;
                            break;
                        }
                        vm.reverseing.list = vm.reverseing.list.concat(list);
                        vm.reverseing.total = data.result.handle_num.handle_num1;
                        break;
                    case '2':
                        if (list.length == 0) {
                            vm.assigning.loadMore = false;
                            break;
                        }
                        vm.assigning.list = vm.assigning.list.concat(list);
                        vm.assigning.total = data.result.handle_num.handle_num2;
                        break;
                    case '3':
                        if (list.length == 0) {
                            vm.fixing.loadMore = false;
                            break;
                        }
                        vm.fixing.list = vm.fixing.list.concat(list);
                        vm.fixing.total = data.result.handle_num.handle_num3;
                        break;
                    case '4,5,6':
                        if (list.length == 0) {
                            vm.finished.loadMore = false;
                            break;
                        }
                        vm.finished.list = vm.finished.list.concat(list);
                        vm.finished.total = data.result.handle_num.handle_num4;
                        break;
                }
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}

//滚动加载
function loadMore() {
    if (document.querySelector('.goods-tab-content-item.active .no-more').getBoundingClientRect().top < document.documentElement.clientHeight) {
        var type = document.querySelector('.goods-tab-content-item.active').dataset.type;
        var page = type == '1' ? ++page1 : (type == '2' ? ++page2 : (type == '3' ? ++page3 : ++page4));
        var loadMore = type == '1' ? vm.reverseing.loadMore : (type == '2' ? vm.assigning.loadMore : (type == '3' ? vm.fixing.loadMore : vm.finished.loadMore));
        getRepairRecord(type, page, loadMore);
    }
}
$('div.goods-tab-content-item').scroll(function () {
    loadMore();
});