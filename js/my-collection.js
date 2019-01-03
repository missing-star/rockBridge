new Vue({
    el:'#app',
    data:{
        //搜索内容
        searchContent:'',
        //商品是否为默认布局方式
        isDefGoodsLayout:true,
        //商家是否为默认布局方式
        isDefBusLayout:true,
        //tab页是否显示商品
        isShowGoods:true
    },
    methods:{
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
        switchTab(type,event) {
            var elem = $(event.target);
            //切换tab
            if(!elem.hasClass('active')) {
                elem.siblings().removeClass('active');
                elem.addClass('active');
                switch(type) {
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
        getDetail(url,id) {
            mui.openWindow({
                url:url
            });
        }
    }
});