var vm = new Vue({
    el:'#app',
    data:{

    },
    methods:{
        goComplain() {
            //投诉页面
            mui.openWindow({
                url:'complaint.html'
            })
        }
    }
})