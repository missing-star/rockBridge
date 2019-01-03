new Vue({
    el:'#app',
    data:{

    },
    methods:{
        getDetail(type,id) {
            mui.openWindow({
                url:'message-detail.html?id='+id +'&type='+type
            })
        }
    }
});