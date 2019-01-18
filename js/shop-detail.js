var vm = new Vue({
    el: '#app',
    data: {
        isFadeIn: false,
        isFadeOut: false,
        //搜索内容
        keyword: '',
        historyList: [],
        currentTab: 'all',
        showTab: 0,
        shopInfo: '',
        hotList: [],
        allList: [],
        searchList: []
    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
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
        getDetail(id) {
            mui.openWindow({
                url: 'goods-detail.html'
            })
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
        searchHistory(name) {
            //从历史记录里点击搜索
            vm.keyword = name;
            this.startSearch();
        },
        startSearch() {
            
        },
        goToComments() {
            mui.openWindow({
                url:'publish-comments.html'
            });
        }
    }
});

$(function () {
    //获得商家详情
    getShopInfo();
    //切换tab
    $("li.tab-item").click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            console.log($(this).attr('data-tab-id'));
            vm.showTab = $(this).attr('data-tab-id');
        }
    });
    //搜索页tab
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.currentTab = $(this).attr('history');
        }
    });
});

function getShopInfo() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsInfo`,
        data: {
            id: getParams().id
        },
        type: 'json',
        dataType: 'json',
        success: function (data) {
            vm.shopInfo = data.result[0];
            vm.hotList = data.result.click_goods_list;
            vm.allList = data.result.goods_list;
            vm.searchList = data.result.goods_list;
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}