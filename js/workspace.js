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
        },
        buySettles() {
            //购买展架
            mui.openWindow({
                url:'shop-settled.html'
            });
        },
        goDetail(url,id) {
            mui.openWindow({
                url:`${url}?id=${id}`
            });
        }
    },
    filters: {
        filterImg(thumb) {
            thumb == null ? '' : thumb;
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