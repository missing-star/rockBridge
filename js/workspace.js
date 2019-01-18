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

function getWorkspaceData() {
    $.ajax({
        url:`${rootUrl}/index/api/getShopsIndex`,
        dataType:'json',
        type:'post',
        success:function(data) {

        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}