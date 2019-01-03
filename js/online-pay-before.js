var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        payNow() {
            //立即缴费
            mui.openWindow({
                url: 'online-pay.html'
            })
        }
    }
});
var categoryIdList = [];
$.ajax({
    url: 'http://dieshiqiao.pzhkj.cn/index/api/getPayCate',
    dataType: 'json',
    type: 'post',
    success: function (data) {
        var classifyPicker = new $.PopPicker();
        var list = [];
        for (key in data.result) {
            categoryIdList.push(data.result[key].id);
        };
        $.ajax({
            url: `${rootUrl}/index/api/getMyPayCharge`,
            type: 'post',
            dataType: 'json',
            data: {

            },
            success: function () {

            },
            error: function () {

            }
        })
    },
    error: function () {
        mui.toast('服务器异常！');
    }

});
//获得缴费记录
function getPayRecord() {
    $.ajax({
        url: `${rootUrl}/index/api/getMyPayCharge`,
        type: 'post',
        dataType: 'json',
        data: {

        },
        success: function () {

        },
        error: function () {

        }
    })
}