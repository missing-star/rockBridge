var param = getParams();
var vm = new Vue({
    el: '#app',
    data: {
        detail: '',
        currentType:0
    },
    methods: {
        getInvoice(id) {
            //发票
            mui.openWindow({
                url: 'apply-invoice.html?id=' + id
            })
        },
        switchType(type) {
            this.currentType = type;
        }
    }
})

function getDetail(id) {
    $.ajax({
        url: `${rootUrl}/index/api/getPayChargeInfo`,
        type: 'post',
        data: {
            id: id
        },
        dataType: 'json',
        success: function (data) {
            if(data.status == 1) {
                vm.detail = data.result;
                jQuery('#qr-code').qrcode({
                    text: "https://www.baidu.com"
                });	
            }
            else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}

getDetail(param.id);