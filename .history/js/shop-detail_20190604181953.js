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
        searchList: [],
        isCollection: '',
        score: 0,
        commentsList: [],
        commentsInfo: {
            service_ratio: '',
            shop_quality: '',
            shop_review: ''
        },
        isMore: true,
        shopBg: {
            backgroundImage: '',
            backgroundSize: '100% 100%'
        }
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
        collect(flag) {
            $.ajax({
                url: `/index/api/getUserCollection`,
                type: 'post',
                dataType: 'json',
                data: {
                    type: 1,
                    id: getParams().id
                },
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        vm.isCollection = flag == 0 ? 1 : 0;
                    }
                },
                error: function () {
                    mui.toast('服务器异常');
                }
            });
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
        getDetail(id) {
            mui.openWindow({
                url: 'goods-detail.html?id=' + id
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
            if (validateUser()) {
                mui.openWindow({
                    url: 'publish-comments.html?id=' + getParams().id
                });
            } else {
                goLogin();
            }
        },
        getShopsDetail() {
            mui.openWindow({
                url: 'shop-base-info.html?shop_id=' + getParams().id
            });
        }
    }
});

$(function () {
    //获得商家详情
    getShopInfo();
    //获得评论列表
    getShopComments();
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

    $(document).scroll(function () {
        if (document.querySelector('div.bottom-line.comments').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (!vm.isMore) {
                return;
            }
            page++;
            getShopComments();
        }
    });
});

function getShopInfo() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsInfo`,
        data: {
            id: getParams().id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            vm.shopInfo = data.result[0];
            vm.hotList = data.result.click_goods_list;
            vm.allList = data.result.goods_list;
            vm.searchList = data.result.goods_list;
            vm.isCollection = data.result.is_collection;
            vm.score = data.result.shop_review;
            vm.shopBg.backgroundImage = `url(${rootUrl}${data.result.bacgd_img})`;
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}
var page = 1;

function getShopComments() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsReviewList`,
        async: false,
        data: {
            shop_id: getParams().id,
            page: page
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            vm.commentsInfo.service_ratio = data.result.service_ratio;
            vm.commentsInfo.shop_quality = data.result.shop_quality;
            vm.commentsInfo.shop_review = data.result.shop_review;
            if (data.result.review_list.length == 0) {
                vm.isMore = false;
                return;
            }
            vm.commentsList = vm.commentsList.concat(data.result.review_list);
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}