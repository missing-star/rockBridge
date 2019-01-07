var vm = new Vue({
    el:'#app',
    data:{

    },
    methods:{
        enterShop(id) {
            //进店
            mui.openWindow({
                url: `shop-detail.html?id=${id}`
            })
        }
    }
})