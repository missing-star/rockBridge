var vm = new Vue({
    el: '#app',
    data: {
        cate_id: '',
        isFadeIn: false,
        isFadeOut: false,
        //商品是否为默认布局方式
        isDefGoodsLayout: true,
        //商家是否为默认布局方式
        isDefBusLayout: true,
        //tab页是否显示商品
        isShowGoods: true,
        historyList: getSearchHistory(),
        goodsList: [],
        shopList: [],
        //商品排序类型
        goodsSort: '',
        //商家排序类型
        shopSort: '',
        //搜索内容
        keyword: '',
        //排序方式
        goodsSortName: 'click_num',
        goodsSortType: 'desc',
        shopSortName: 0,
        shopSortType: 1,
        isMoreGoods: true,
        isMoreShops: true,
        //大分类
        currentIndex: 0,
        //小分类
        currentInnerIndex: -1,
        //是否展开小分类
        isOpen: false,
        categoryList: [],
        categoryItemList: [],
        selectedCat: '全部'

    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
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
            if (this.isOpen) {
                this.isOpen = false;
            }
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
            //开始搜索
            if (this.isShowGoods) {
                page1 = 1;
                this.goodsList = [];
                getGoodsList(this.keyword, this.goodsSortName, this.goodsSortType, page1);
            } else {
                page2 = 1;
                this.shopList = [];
                getShopList(this.keyword, this.shopSortType, this.shopSortName, page2);
            }
            saveSearchKeywords();
            this.hideSearch();
        },
        switchCategoryTab(index, id) {
            if (index == this.currentIndex) {
                return false;
            }
            page1 = 1;
            this.selectedCat = this.categoryList[index].cate_name;
            this.cate_id = id;
            this.currentInnerIndex = -1;
            this.currentIndex = index;
            getCategory(id, 2);
            if(page1 == 1) {
                this.goodsList = [];
            }
            getGoodsList(this.keyword, this.goodsSortName, this.goodsSortType, page1);
        },
        switchInner(index, id) {
            if (this.currentInnerIndex == index) {
                return false;
            }
            this.cate_id = id;
            this.currentInnerIndex = index;
            this.selectedCat = this.categoryItemList[index].cate_name;
            if (this.isOpen) {
                this.isOpen = false;
            }
            vm.goodsList = [];
            getGoodsList(this.keyword, this.goodsSortName, this.goodsSortType, page1);
        },
        //切换小分类布局（展开/收起）
        triggerLayout() {
            this.isOpen = !this.isOpen;
        }
    }
});
var page1 = 1;
var page2 = 1;
$(function () {
    if (getParams().keywords) {
        vm.keyword = decodeURI(getParams().keywords);
        vm.startSearch();
    } else {
        getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
        getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, page2);
    }
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    });
    $(document, '.tab-content.goods.active.goods-line').scroll(function () {
        if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (vm.isShowGoods && vm.isMoreGoods) {
                //滚动加载商品
                getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, ++page1);
            } else if (!vm.isShowGoods && vm.isMoreShops) {
                //滚动加载商家
                getShopList(vm.keyword, vm.shopSortType, vm.shopSortName, ++page2);
            }
        }
    });
    //分类tab页切换
    $('li.sort-item').click(function () {
        page1 = page2 = 1;
        var fields = $(this).attr('data-sort-type');
        var type = 'desc';
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        } else {
            $(this).toggleClass('asc');
            $(this).siblings().removeClass('asc');
            if ($(this).hasClass('asc')) {
                type = 'asc';
            }
        }
        if (vm.isShowGoods) {
            vm.goodsSortName = fields;
            vm.goodsSortType = type;
            vm.goodsList = [];
            getGoodsList(vm.keyword, vm.goodsSortName, vm.goodsSortType, page1);
        } else {
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
        async: false,
        data: {
            keyword: keyword,
            fields: fields,
            type: type,
            page: page,
            cate_id: vm.cate_id
        },
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.result.length == 0) {
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
        async: false,
        data: {
            keyword: keyword,
            sort: sort,
            type: type,
            page: page,
            cate_id: vm.cate_id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.result.length == 0) {
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
/**
 * 保存用户输入的关键字
 */
function saveSearchKeywords() {
    $.ajax({
        url: `${rootUrl}/index/api/getAddSerachLog`,
        type: 'post',
        data: {
            keywords: vm.keyword
        },
        success: function () {},
        error: function () {
            mui.toast('服务异常');
        }
    });
}
getCategory(undefined, 1);

function getCategory(cat_id, type) {
    var data = {};
    if (cat_id) {
        data.cate_id = cat_id;
    }
    $.ajax({
        url: `${rootUrl}/index/api/getGoodsCateList`,
        type: 'post',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (type == 1) {
                //获取大分类（首次进入页面）
                data.result.splice(0, 0, {
                    id: '',
                    cate_name: '全部'
                });
                vm.categoryList = data.result;
                getCategory('',2);
            } else {
                //获取小分类
                vm.categoryItemList = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}