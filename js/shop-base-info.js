const vm = new Vue({
    el: '#app',
    data: {
        shopInfo:''
    },
    filters:{
        filterImg(thumb) {
            thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {

    }
});

getShopInfo();

function getShopInfo() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsShopsInfo`,
        data: {
            id: JSON.parse(localStorage.getItem('user')).shop_id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if(data.status == 1) {
                vm.shopInfo = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}