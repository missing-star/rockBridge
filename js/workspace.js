new Vue({
    el:'#app',
    data:{

    },
    methods:{
        getShopDetail(shopId) {
            mui.openWindow({
                url:'shop-base-info.html'
            })
        }
    }
});