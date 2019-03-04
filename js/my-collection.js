var page = 1;
var vm = new Vue({
    el: '#app',
    data: {
        //搜索内容
        searchContent: '',
        //商品是否为默认布局方式
        isDefGoodsLayout: true,
        //商家是否为默认布局方式
        isDefBusLayout: true,
        //tab页是否显示商品
        isShowGoods: true,
        goodsList: [],
        shopList: [],
        isMore:true
    },
    methods: {
        clearInput() {
            //清空搜索框
            this.searchContent = '';
        },
        switchGoodsLayout() {
            //切换商品布局
            this.isDefGoodsLayout = !this.isDefGoodsLayout;
        },
        switchBusLayout() {
            //切换商家布局
            this.isDefBusLayout = !this.isDefBusLayout;
        },
        switchTab(type, event) {
            var elem = $(event.target);
            //切换tab
            if (!elem.hasClass('active')) {
                elem.siblings().removeClass('active');
                elem.addClass('active');
                switch (type) {
                    case 0:
                        this.isShowGoods = true;
                        //切换到商品
                        break;
                    case 1:
                        this.isShowGoods = false;
                        //切换到商铺
                        break;
                }
            }
        },
        getDetail(url, id) {
            mui.openWindow({
                url: `${url}?id=${id}`
            });
        }
    }
});
getMyCollection();

function getMyCollection() {
    $.ajax({
        url: `${rootUrl}/index/api/getMyCollection`,
        type: 'post',
        async:false,
        data: {
            page: page
        },
        dataType: 'json',
        success: function (data) {
            if(data.result.goods_list.length == 0 && data.result.shops_list.length == 0) {
                vm.isMore =false;
                return;
            }
            if (data.status == 1) {
                vm.goodsList = vm.shopList.concat(data.result.goods_list);
                vm.shopList = vm.shopList.concat(data.result.shops_list);
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

$(document).scroll(function () {
   if(document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
       //滚动加载更多
       if(vm.isMore) {
           page++;
           getMyCollection();
       }
   } 
});