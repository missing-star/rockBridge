var vm = new Vue({
    el: '#app',
    data: {
        keyword: '',
        isFadeIn: false,
        isFadeOut: false,
        searchContent: '',
        currentTab: 'all',
        //是否已入驻
        isSettled: false,
        isForce:true,
        historyList: getSearchHistory(),
        itemList: [{
                icon: 'imgs/safe.png',
                title: '商家认证',
                desc: '商品安全保障',
                url: 'shop-auth.html'
            },
            {
                icon: 'imgs/home-line.png',
                title: '商铺入驻',
                desc: '线上线下一体化',
                // url: 'shop-settled.html',
                url: 'shop-data-setting.html'
            },
            {
                icon: 'imgs/setting.png',
                title: '在线缴费',
                desc: '商铺线上管理',
                url: 'online-pay.html'
            },
            {
                icon: 'imgs/phone.png',
                title: '联系我们',
                desc: '随时随地资讯',
                url: 'contact-us.html'
            }
        ],
        homeInfo: '',
        showMsg:''
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
        showSearch() {
            //打开搜索页
            this.isFadeIn = true;
            this.isFadeOut = false;
            $("input#search").focus();
        },
        searchHistory(name) {
            //从历史记录里点击搜索
            vm.keyword = name;
            this.startSearch();
        },
        startSearch() {
            //跳转到商品页搜索
            mui.openWindow({
                url: 'goods.html?keywords=' + vm.keyword
            });
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
        jumpLink(url, flag, isShop) {
            //认证，缴费，入驻，联系我们跳转
            if (flag) {
                //需要登录操作
                if (validateUser()) {
                    if (sessionStorage.getItem('switchRole') == 0) {
                        //不是商家
                        if(vm.isForce) {
                            mui.toast(vm.showMsg);
                            return;
                        }
                        if(isShop == 1 || isShop == 2) {
                            mui.openWindow({
                                url:'shop-auth.html'
                            });
                        }
                        else {
                            mui.openWindow({
                                url:url
                            });
                        }
                        return false;
                    }
                    else {
                        if(isShop == 1) {
                           mui.toast('您已进行过商户认证');
                           return false;
                        }
                        //缴费 和 其他
                        mui.openWindow({
                            url:url
                        });
                    }
                } else {
                    mui.openWindow({
                        url:'login.html'
                    });
                }
            } else {
                //无需登录操作
                mui.openWindow({
                    url: url
                });
            }
        },
        goInner(url) {
            mui.openWindow({
                url: url
            });
        },
        goDetail(url, id) {
            //详情页
            mui.openWindow({
                url: `${url}?id=${id}`
            });
        },
        goAd(url) {
            mui.openWindow({
                url: url
            });
        },
        enterShop(id) {
            //进店
            mui.openWindow({
                url: `shop-detail.html?id=${id}`
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
        //预约商品
        reGoods() {
            console.log('预约商品');
        }
    }
});

$(function () {
    getData();
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.currentTab = $(this).attr('history');
        }
    });
});

/**
 * 获得首页数据
 */

function getData() {
    $.ajax({
        url: `${rootUrl}/index/api/getIndex`,
        type: 'post',
        success: function (data) {
            if (data.status == 1) {
                vm.homeInfo = data.result;
                vm.$nextTick(function () {
                    initBanner();
                });
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}


function initBanner() {
    var swiper = new Swiper('.swiper-container', {
        autoHeight: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        loop: true
    });
}
getUserInfo();

/**
 * 获得申请商户的信息
 */
function getApplyInfo() {
    $.ajax({
        url:`${rootUrl}/index/api/getAddShopInfo`,
        dataType:'json',
        type:'post',
        async:false,
        success:function(data) {
            if(data.status == -1) {
                vm.showMsg = data.msg;
            }
            else {
                vm.isForce = false;
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}
getApplyInfo();