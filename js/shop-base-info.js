var vm = new Vue({
    el: '#app',
    data: {
        shopInfo:''
    },
    filters:{
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        togglePopover() {
            if(this.shopInfo.customer_service_image == null) {
                mui.alert('您还未上传微信二维码!');
                return;
            }
            mui('#sheet1').popover('toggle');
        }
    }
});

getShopInfo();

function getShopInfo() {
    var id = '';
    if(getParams().shop_id) {
        id = getParams().shop_id;
    }
    else {
        id = JSON.parse(sessionStorage.getItem('user')).shop_id;
    }
    $.ajax({
        url: `${rootUrl}/index/api/getShopsShopsInfo`,
        data: {
            id: id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if(data.status == 1) {
                vm.shopInfo = data.result;
            }else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}