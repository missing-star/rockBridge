var vm = new Vue({
    el: '#app',
    data: {
        currentTab: 'all',
        showTab: 0,
        shopInfo: '',
        hotList: [],
        score: 0,
        bgList:JSON.parse(localStorage.getItem('bgList')),
        currentBg:localStorage.getItem('currentBg')
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
    computed: {
        currentBg:function() {
            return `bg/${this.currentBg}.png`;
        }
    },
});

$(function () {
    //获得商家详情
    // getShopInfo();
    //切换tab
    $("li.tab-item").click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            console.log($(this).attr('data-tab-id'));
            vm.showTab = $(this).attr('data-tab-id');
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
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}
