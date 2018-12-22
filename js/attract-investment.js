new Vue({
    el:'#app',
    data:{

    },
    methods:{
        goDetail(id) {
            mui.openWindow({
                url:'attract-investment-detail.html?id=' + id
            })
        }
    }
})