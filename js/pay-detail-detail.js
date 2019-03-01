var param = getParams();
var vm = new Vue({
    el: '#app',
    data: {
        detail: ''
    },
    methods: {
        getInvoice(id) {
            //发票
            mui.openWindow({
                url: 'apply-invoice.html?id=' + id
            })
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