var param = getParams();
var vm = new Vue({
    el: '#app',
    data: {
        detail: '',
        currentType:-1,
        pay_order:''
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
            createQrCode('2'+this.currentType.toString() + this.pay_order.toString());
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
                vm.pay_order = data.result.pay_order;
                if(data.result.pay_status == 1) {
                    createQrCode('1' + data.result.pay_order.toString());
                }
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

function createQrCode(content) {
    jQuery('#qr-code').html('');
    jQuery('#qr-code').qrcode({
        text: content
    });	
}