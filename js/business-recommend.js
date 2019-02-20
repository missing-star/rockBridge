var vm = new Vue({
    el:'#app',
    data:{
        shopsList:[]
    },
    methods:{
        enterShop(id) {
            //进店
            mui.openWindow({
                url: `shop-detail.html?id=${id}`
            })
        },
        getDetail(url,id) {
            mui.openWindow({
                url:`${url}?id=${id}`
            })
        }
    },
    filters:{
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
});

getShopsList();
function getShopsList() {
    $.ajax({
        url:`${rootUrl}/index/api/getHotShops`,
        dataType:'json',
        type:'post',
        success:function(data) {
            if(data.status == 1) {
                vm.shopsList = data.result;
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}