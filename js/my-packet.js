var vm = new Vue({
    el:'#app',
    data:{

    },
    methods:{
        getDetail() {
            mui.openWindow({
                url:'my-packet-detail.html'
            })
        }
    }
});
