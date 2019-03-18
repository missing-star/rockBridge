var vm = new Vue({
    el: '#app',
    data: {
        nowNums: JSON.parse(sessionStorage.getItem('user')).shops.show_goods_num,
        buyNums: 10,
        price: JSON.parse(sessionStorage.getItem('user')).shops.goods_show_price,
        totalMoney: 0,
        isDisabled: false,
        msg: '',
        str: '',
        isNext: false,
        payDirection:'下一步',
        payWay:'',
        payWayId:''
    },
    methods: {
        validateNum() {
            this.buyNums = this.buyNums.replace(".", "");
            var reg = /^[1-9]+\d*$/;
            if (!reg.test(this.buyNums)) {
                this.isDisabled = true;
                this.msg = '您输入的数量有误';
            } else {
                this.msg = '';
                this.totalMoney = this.buyNums * this.price * 1.006
                this.isDisabled = false;
            }
        },
        submitOrder() {
            $.ajax({
                url: `${rootUrl}/index/api/displayDopay`,
                type: 'post',
                dataType: 'json',
                data: {
                    buy_num: vm.buyNums,
                    pay_method:this.payWayId
                },
                success: function (data) {
                    if (data.status == 1) {
                        vm.str = data.info;
                        vm.isNext = true;
                    } else if (data.status == 202) {
                        goLogin();
                    }
                }
            });
        },
        hideSubmit() {
            this.isNext = false;
        },
        submit() {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            } else {
                jsApiCall();
            }
        }
    },
    created() {
        this.totalMoney = this.buyNums * this.price * 1.006
    },
});
$(function () {
    $("li.setp1").click(function () {
        if (!$(this).hasClass('active')) {
            var id = $(this).attr('item-id');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.classify.forEach(function (item, index) {
                if (item.id.toString() == id) {
                    vm.selectedShop = item.name;
                }
            });
        }
    });
    $("li.setp2").click(function () {
        if (!$(this).hasClass('active')) {
            var id = $(this).attr('item-id');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.zjList.forEach(function (item, index) {
                if (item.id.toString() == id) {
                    vm.selectedZj = item.name;
                    vm.selectedZjPrice = item.money;
                }
            });
        }
    });
});

(function ($, doc) {
    $.init();
    $.ready(function () {
        var payPicker = new $.PopPicker();
        var result = getPayWay().map(function (item) {
            return {
                value: item.id,
                text: item.name,
                fate: item.service_price
            }
        });
        payPicker.setData(result);
        var eventBtn = doc.getElementById('pay-way');
        eventBtn.addEventListener('tap', function (event) {
            payPicker.show(function (items) {
                vm.payWayId = items[0].value;
                vm.payWay = items[0].text;
            });
        }, false);
        payPicker.pickers[0].setSelectedIndex(0);
        payPicker.pickers[0].items.forEach(function (pay, index) {
            if (index == 0) {
                vm.payWayId = pay.value;
                vm.payWay = pay.text;
            }
        });

    });
})(mui,document);

/**
 * 微信支付
 */
function jsApiCall() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        JSON.parse(vm.str),
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                mui.toast('支付成功!');
                setTimeout(function () {
                    mui.openWindow({
                        url: 'workspace.html'
                    });
                }, 200);
            } else {
                //支付失败/用户取消支付

            }
        }
    );
}

/**
 * 获得支付方式
 */
function getPayWay() {
    var result = [];
    $.ajax({
        url: `${rootUrl}/index/api/getPayment`,
        dataType: 'json',
        type: 'post',
        data: {
            type: 1
        },
        async: false,
        success: function (data) {
            if (data.status == 1) {
                result = data.result;
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
    return result;
}