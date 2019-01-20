var vm = new Vue({
    el:'#app',
    data:{
        shopInfo:''
    },
    methods:{
        getShopDetail(shopId) {
            mui.openWindow({
                url:'shop-base-info.html'
            })
        }
    }
});
getWorkspaceData();
function getWorkspaceData() {
    $.ajax({
        url:`${rootUrl}/index/api/getShopsIndex`,
        dataType:'json',
        type:'post',
        success:function(data) {
            vm.shopInfo = data.result;
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}