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
        historyList: JSON.parse(localStorage.getItem('historyList')) || [],
        goodsList: [],
        shopList: [],
        //商品排序类型
        goodsSort: '',
        //商家排序类型
        shopSort: '',
        //搜索内容
        keyword: '',
        //排序方式
        goodsSortName:'click_num',
        goodsSortType: 'desc',
        shopSortName:0,
        shopSortType: 1,
        isMoreGoods:true,
        isMoreShops:true

    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
           if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        limitContent() {
            this.keyword = this.keyword.replace(/\s+/g, "");
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
            this.keyword = '';
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
                        if (vm.keyword != '') {
                            page1 = 1;
                            vm.goodsList = [];
                            getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
                        }
                        //切换到商品
                        break;
                    case 1:
                        this.isShowGoods = false;
                        if (vm.keyword != '') {
                            page2 = 1;
                            vm.shopList = [];
                            getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, page2);
                        }
                        //切换到商铺
                        break;
                }
            }
        },
        getDetail(url, id) {
            mui.openWindow({
                url: `${url}?id=${id}`
            });
        },
        clearHistory() {
            //清空历史记录
            this.historyList = [];
        },
        searchHistory(name) {
            //从历史记录里点击搜索
            this.keyword = name;
            this.startSearch();
        },
        startSearch() {
            if(this.historyList.join('-').indexOf(this.keyword) == -1) {
                this.historyList.push(this.keyword);
                localStorage.setItem('historyList',JSON.stringify(this.historyList));
            }
            //开始搜索
            if (vm.isShowGoods) {
                page1 = 1;
                vm.goodsList = [];
                getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
            } else {
                page2 = 1;
                vm.shopList = [];
                getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, page2);
            }
            this.hideSearch();
        }
    },
    mounted() {
        if(getParams().keywords) {
            this.keyword = decodeURI(getParams().keywords);
            this.startSearch();
        }
    }
});
var page1 = 1;
var page2 = 1;
$(function () {
    getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
    getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, page2);
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    });
    $(document).scroll(function () {
        if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (vm.isShowGoods && vm.isMoreGoods) {
                //滚动加载商品
                getGoodsList(vm.keyword,vm.goodsSortName,vm.goodsSortType, ++page1);
            } else if(!vm.isShowGoods && vm.isMoreShops) {
                //滚动加载商家
                getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, ++page2);
            }
        }
    });
    //分类tab页切换
    $('li.sort-item').click(function () {
        var fields = $(this).attr('data-sort-type');
        var type = 'desc';
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        } else {
            $(this).toggleClass('asc');
            $(this).siblings().removeClass('asc');
            if($(this).hasClass('asc')) {
                type = 'asc';
            }
        }
        if(vm.isShowGoods) {
            vm.goodsSortName = fields;
            vm.goodsSortType = type;
            vm.goodsList = [];
            getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
        }
        else {
            vm.shopSortName = fields;
            vm.shopSortType = type == 'asc' ? 2 : 1;
            vm.shopList = [];
            getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, page2);
        }
    });
});
//关键字-排序类型（点击量）-排序方式（desc,asc)
function getGoodsList(keyword, fields, type, page) {
    $.ajax({
        url: `${rootUrl}/index/api/getGoodsList`,
        async:false,
        data: {
            keyword: keyword,
            fields: fields,
            type: type,
            page: page
        },
        dataType:'json',
        type: 'post',
        success: function (data) {
            if(data.result.length == 0) {
                vm.isMoreGoods = false;
                return;
            }
            if (data.status == 1) {
                vm.goodsList = vm.goodsList.concat(data.result);
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
        async:false,
        data: {
            keyword: keyword,
            sort: sort,
            type: type,
            page: page
        },
        type:'post',
        dataType:'json',
        success: function (data) {
            if(data.result.length == 0) {
                vm.isMoreShops = false;
                return;
            }
            if (data.status == 1) {
                vm.shopList = vm.shopList.concat(data.result);
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}