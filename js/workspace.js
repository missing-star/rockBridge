getUserInfo();
if(sessionStorage.getItem('switchRole') == 0) {
    mui.confirm('您还不是商户!', '', ['确定'], function (e) {
        mui.openWindow({
            url:'index.html'
        });
    });
}
sessionStorage.setItem('currentRole',1);
var vm = new Vue({
    el: '#app',
    data: {
        shopInfo: ''
    },
    methods: {
        getShopDetail(shopId) {
            mui.openWindow({
                url: 'shop-base-info.html'
            })
        },
        buySettles() {
            //购买展架
            mui.openWindow({
                url: 'shop-settled.html'
            });
        },
        goDetail(url, id) {
            mui.openWindow({
                url: `${url}?id=${id}`
            });
        }
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
});
getWorkspaceData();

function getWorkspaceData() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsIndex`,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.status == 1) {
                vm.shopInfo = data.result;
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}