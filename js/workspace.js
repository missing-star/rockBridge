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
    },
    filters: {
        filterImg(thumb) {
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
});
getWorkspaceData();
function getWorkspaceData() {
    $.ajax({
        url:`${rootUrl}/index/api/getShopsShopsInfo`,
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