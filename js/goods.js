var vm = new Vue({
    el: '#app',
    data: {
        isFadeIn: false,
        isFadeOut: false,
        //商品是否为默认布局方式
        isDefGoodsLayout: true,
        //商家是否为默认布局方式
        isDefBusLayout: true,
        //tab页是否显示商品
        isShowGoods: true,
        historyList: {
            goods: ['手机', '羽绒服', '笔记本电脑'],
            shops: ['联想旗舰店', '金士顿旗舰店', '天猫超市']
        },
        goodsList: [],
        shopList: [],
        currentTab: 'all',
        //商品排序类型
        goodsSort: '',
        //商家排序类型
        shopSort: '',
        //搜索内容
        searchContent: '',
        //排序方式
        goodsSortType: 'desc',
        shopSortType: 'SORT_DESC'


    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        limitContent() {
            this.searchContent = this.searchContent.replace(/\s+/g, "");
        },
        showSearch() {
            //打开搜索页
            this.isFadeIn = true;
            this.isFadeOut = false;
            $("input#search").focus();
        },
        hideSearch() {
            //关闭搜索页
            this.isFadeIn = false;
            this.isFadeOut = true;
        },
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
                        if (vm.searchContent != '') {
                            page1 = 1;
                            getGoodsList(vm.keyword, vm.goodsSortType, vm.goodsSort, page1);
                        }
                        //切换到商品
                        break;
                    case 1:
                        this.isShowGoods = false;
                        if (vm.searchContent != '') {
                            page2 = 1;
                            getShopList(vm.keyword, vm.shopSort, vm.shopSortType, page2);
                        }
                        //切换到商铺
                        break;
                }
            }
        },
        getDetail(url, id) {
            mui.openWindow({
                url: url
            });
        },
        clearHistory(name) {
            //清空历史记录
            switch (name) {
                case 'all':
                    this.historyList = {
                        goods: [],
                        shops: []
                    };
                    break;
                case 'shops':
                    this.historyList.shops = [];
                    break;
                case 'goods':
                    this.historyList.goods = [];
            }
        },
        startSearch() {
            //开始搜索
            if (vm.isShowGoods) {
                page1 = 1;
                getGoodsList(vm.keyword, vm.goodsSortType, vm.goodsSort, page1);
            } else {
                page2 = 1;
                getShopList(vm.keyword, vm.shopSort, vm.shopSortType, page2);
            }
        }
    }
});
var page1 = 1;
var page2 = 1;
$(function () {
    getGoodsList('', 'click_num', 'desc', page1);
    getShopList('', 1, 0, page2);
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.currentTab = $(this).attr('history');
        }
    });
    $(document).scroll(function () {
        if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (vm.isShowGoods) {
                //滚动加载商品
                getGoodsList(vm.keyword, vm.goodsSortType, vm.goodsSort, ++page1);
            } else {
                //滚动加载商家
                getShopList(vm.keyword, vm.shopSort, vm.shopSortType, page2);
            }
        }
    });
    //分类tab页切换
    $('li.sort-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        } else {
            $(this).addClass('asc');
            $(this).siblings().removeClass('asc');
        }
    });
});
//关键字-排序类型（点击量）-排序方式（desc,asc)
function getGoodsList(keyword, fields, type, page) {
    $.ajax({
        url: `${rootUrl}/index/api/getGoodsList`,
        data: {
            keyword: keyword,
            fields: fields,
            type: type,
            page: page
        },
        dataType:'json',
        type: 'post',
        success: function (data) {
            if (data.status == 1) {
                vm.goodsList = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}
//关键字-排序方式（desc,asc）-排序类型（收藏量，评分）
function getShopList(keyword, sort, type, page) {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsList`,
        data: {
            keyword: keyword,
            sort: sort,
            type: type,
            page: page
        },
        type:'post',
        dataType:'json',
        success: function (data) {
            if (data.status == 1) {
                vm.shopList = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}