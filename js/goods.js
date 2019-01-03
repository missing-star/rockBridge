var vm = new Vue({
    el: '#app',
    data: {
        isFadeIn: false,
        isFadeOut: false,
        //搜索内容
        searchContent: '',
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
        goodsList:[],
        currentTab: 'all'
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
        }
    }
});
$(function () {
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.currentTab = $(this).attr('history');
        }
    });
    $(document).scroll(function() {
        if(document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if(vm.isShowGoods) {
                //显示商品

            }
        }
    });
});