var vm = new Vue({
    el: '#app',
    data: {
        nowNums:JSON.parse(sessionStorage.getItem('user')).shops.show_goods_num,
        buyNums:10,
        price:JSON.parse(sessionStorage.getItem('user')).shops.goods_show_price,
        totalMoney:0,
        isDisabled:false,
        msg:'',
        str:'',
        isNext:false
    },
    methods: {
        validateNum() {
            this.buyNums = this.buyNums.replace(".","");
            var reg = /^[1-9]+\d*$/;
            if(!reg.test(this.buyNums)) {
                this.isDisabled = true;
                this.msg = '您输入的数量有误';
            }
            else {
                this.msg = '';
                this.totalMoney = this.buyNums*this.price*1.006
                this.isDisabled = false;
            }
        },
        submitOrder() {
            $.ajax({
                url:`${rootUrl}/index/api/displayDopay`,
                type:'post',
                dataType:'json',
                data:{
                    buy_num:vm.buyNums
                },
                success:function(data) {
                    if(data.status == 1) {
                        vm.str = data.info;
                        vm.isNext = true;
                    }else if (data.status == 202) {
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
        this.totalMoney = this.buyNums*this.price*1.006
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
                setTimeout(function() {
                    mui.openWindow({
                        url:'workspace.html'
                    });
                }, 200);
            }
            else {
                //支付失败/用户取消支付
                
            }
        }
    );
}