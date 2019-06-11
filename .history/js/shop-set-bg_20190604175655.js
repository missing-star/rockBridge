var vm = new Vue({
    el: '#app',
    data: {
        currentTab: 'all',
        showTab: 0,
        shopInfo: '',
        hotList: [],
        score: 0,
        bgList:[],
        currentBgIndex:0,
        bgHistory:[],
        currentPreview:-1,
        currentCode:''
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
            return {
                backgroundImage:`url(${this.currentCode})`,
                backgroundSize:'100% 100%'
            }
        }
        
    },
    methods: {
        // 更换背景图
        changeBg() {
            $.ajax({
                url:`${rootUrl}/index/api/getHistoryBacgdList`,
                type:'post',
                dataTpe:'json',
                data:{
                    bg_id:this.currentBgIndex
                },
                success:function(data) {
                    if(data.status == 1) {
                        mui.toast('设置成功');
                    }
                    else {
                        mui.toast('设置失败');
                    }
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        },
        // 获得对应下标的图片
        getBg(index) {
            return `bg/${this.bgList[index]}.png`;
        },
        // 预览
        previewBg(id,code) {
            this.currentPreview = id;
            this.currentBgIndex = id;
            this.currentCode = `${rootUrl}${code}`;
        },
        getBgList() {
            var vm = this;
            $.ajax({
                url:`${rootUrl}/index/api/getBacgdList`,
                type:'post',
                dataTpe:'json',
                success:function(data) {
                    vm.bgList = data.result;
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        },
        getBgHistoryList() {
            var vm = this;
            $.ajax({
                url:`${rootUrl}/index/api/getHistoryBacgdList`,
                type:'post',
                dataTpe:'json',
                success:function(data) {
                    vm.bgHistory = data.result;
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        }
    },
    mounted() {
        this.getBgList();
        this.getBgHistoryList();
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
