var vm = new Vue({
    el: '#app',
    data() {
        return {
            passList: [],
            checkList: [],
            refuseList: []
        }
    },
    methods: {
        goBind() {
            mui.openWindow({
                url: 'bind-shops-add.html'
            });
        },
        //详情
        getDetail(id) {
            mui.openWindow({
                url: `shops-shops-detail.html?id=${id}`
            });
        },
        //编辑
        editShops(id) {
            mui.openWindow({
                url: `bind-shops-add.html?id=${id}&type=edit`
            });
        },
        //解绑
        unbindShops(id) {
            mui.confirm('确定解绑该商铺？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getRemoveBindingAddress`,
                        data: {
                            id: id
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            }else if(data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        }
    }
});
$(function () {
    $('li.goods-tab-bar-item').click(function () {
        //切换tab页
        if (!$(this).hasClass('active')) {
            var status = $(this).attr('data-type');
            var index = Array.prototype.slice.call(document.querySelectorAll('li.goods-tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.goods-tab-content-item').eq(index).addClass('active');
            $('div.goods-tab-content-item').eq(index).siblings().removeClass('active');
            getShopsList(status);
        }
    });
    getShopsList(1);
});


function getShopsList(status) {
    $.ajax({
        url: `${rootUrl}/index/api/getBindingAddressList`,
        type: 'post',
        data: {
            type: status
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            if(data.status == 1) {
                switch (parseInt(status)) {
                    case 1:
                        vm.passList = data.result;
                        break;
                    case 2:
                        vm.checkList = data.result;
                        break;
                }
            }
            else if(data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}