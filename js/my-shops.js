const vm = new Vue({
    el: '#app',
    data() {
        return {
            passList:[],
            checkList:[],
            refuseList:[]
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
        data: {
            status: status
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            switch (parseInt(status)) {
                case 1:
                    vm.passList = data.result;
                    break;
                case 2:
                    vm.checkList = data.result;
                    break;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}