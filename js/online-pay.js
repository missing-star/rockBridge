var vm = new Vue({
    el: '#app',
    data: {
        selectedClassify: '',
        selectedId: '',
        //户号
        userNum: JSON.parse(localStorage.getItem('user')).shops.shop_code,
        //需要交纳的费用
        money: '',
        //支付费率
        payFate:0,
        //用户输入的费用
        inputMoney: '',
        description: '',
        payWay: '',
        isNext: false,
        //是否显示选择报修单
        isShowRepair: false,
        //选择的报修单
        selectedRepairId: '',
        //选择的报修单名称
        selectedRepairName: '',
        //选择的商铺地址
        selectedShopAddress:'',
        //地址id
        selectedShopAddressId:'',
        str: ''
    },
    methods: {
        goDetail() {
            mui.openWindow({
                url: 'pay-detail.html'
            });
        },
        next() {
            if (this.selectedClassify == '') {
                mui.toast('请选择缴费类型！');
                return false;
            } else if (this.selectedId == 0 && this.selectedRepairId == '') {
                mui.toast('请选择报修单！');
                return false;
            } else if(this.selectedId != 0 && this.selectedShopAddressId == '') {
                mui.toast('请选择商铺地址！');
                return false;
            }
            else if (!parseFloat(this.inputMoney) || this.inputMoney == '') {
                mui.toast('请输入缴费金额！');
                return false;
            } else if (this.payWay == '') {
                mui.toast('请选择支付方式！');
            }
            //提交订单
            var formData = {
                cate_id: this.selectedId,
                content: this.description,
                actual_payment: this.inputMoney,
                pay_method: this.payWay,
                address_id:this.selectedShopAddressId
            };
            $.ajax({
                url: `${rootUrl}/index/api/getAddPayCharge`,
                type: 'post',
                data: formData,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.status != 1) {
                        mui.toast('订单提交失败!');
                        return false;
                    } else {
                        vm.payOrder = data.result.pay_order;
                        //获取信息
                        getInfo();
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            });
            //下一步
            this.isNext = true;
        },
        validateDesc() {
            this.description = replaceSpace(this.description);
        },
        hidePreview() {
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
    }
});

(function ($, doc) {
    $.init();
    $.ready(function () {
        //电费类型选择
        jQuery.ajax({
            url: 'http://dieshiqiao.pzhkj.cn/index/api/getPayCate',
            dataType: 'json',
            type: 'post',
            success: function (data) {
                //缴费类型picker
                var classifyPicker = new $.PopPicker();
                //商铺地址picker
                var addressPicker = new $.PopPicker();
                var list = [{
                    value: 0,
                    text: '报修单缴费',
                    money: 100
                }];
                var addList = [];
                for (key in data.result.pay_category) {
                    list.push({
                        value: data.result.pay_category[key].id,
                        text: data.result.pay_category[key].name,
                        money: data.result.pay_category[key].pay_money
                    });
                };
                for(key in data.result.property_address) {
                    addList.push({
                        value:data.result.property_address[key].id,
                        text:data.result.property_address[key].province + result.property_address[key].city + result.property_address[key].area + result.property_address[key].address
                    });
                }
                classifyPicker.setData(list);
                addressPicker.setData(addList);
                //缴费类型选择
                var eventBtn = doc.getElementById('classify');
                eventBtn.addEventListener('tap', function (event) {
                    classifyPicker.show(function (items) {
                        vm.selectedClassify = items[0].text;
                        vm.selectedId = items[0].value;
                        vm.money = items[0].money == 0 ? '' : items[0].money;
                        vm.inputMoney = items[0].money == 0 ? '' : items[0].money;
                        if (items[0].value == 0) {
                            vm.isShowRepair = true;
                            getRepairRecord();
                        } else {
                            vm.isShowRepair = false;
                        }
                    });
                }, false);
                //商铺地址选择
                var addBtn = doc.getElementById('address');
                addBtn.addEventListener('tap', function (event) {
                    addressPicker.show(function (items) {
                        vm.selectedShopAddressId = items[0].value;
                        vm.selectedShopAddress = items[0].text;
                    });
                }, false);
            },
            error: function () {
                mui.toast('服务器异常！');
            }

        })
    });
    var payPicker = new $.PopPicker();
    let result = getPayWay().map(function(item) {
        return {
            value:item.id,
            text:item.name,
            fate:item.service_price
        }
    });
    payPicker.setData(result);
    var eventBtn = doc.getElementById('pay-way');
    eventBtn.addEventListener('tap', function (event) {
        payPicker.show(function (items) {
            vm.payFate = items[0].fate;
            vm.payWay = items[0].text;
            console.log(vm.payWay);
        });
    }, false);
})(mui, document);

function getRepairRecord() {
    $.ajax({
        url: `${rootUrl}/index/api/getMyPayOrder`,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            var list = [];
            var repairPicker = new mui.PopPicker();
            for (key in data.result) {
                list.push({
                    value: data.result[key].re_code,
                    text: data.result[key].re_code,
                    money: data.result[key].re_money
                });
            };
            repairPicker.setData(list);
            var eventBtn = document.getElementById('repair-list');
            eventBtn.addEventListener('tap', function (event) {
                repairPicker.show(function (items) {
                    vm.selectedRepairName = items[0].text;
                    vm.selectedRepairId = items[0].value;
                    vm.money = items[0].money == 0 ? '' : items[0].money;
                    vm.inputMoney = items[0].money == 0 ? '' : items[0].money;
                });
            }, false);
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}
/**
 * 获得商家信息
 */
function getInfo() {
    //获得后端返回公众号等信息
    $.ajax({
        url: `${rootUrl}/index/api/dopay`,
        type: 'post',
        data: {
            pay_order: vm.payOrder,
            title: vm.selectedClassify
        },
        async: false,
        dataType: 'json',
        success: function (data) {
            vm.str = data.info;
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    });
}

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
                        url:'pay-detail.html'
                    });
                }, 200);
            }
            else {
                //支付失败/用户取消支付
                
            }
        }
    );
}

/**
 * 获得支付方式
 */
function getPayWay() {
    let result = [];
    $.ajax({
        url:`${rootUrl}/index/api/getPayment`,
        dataType:'json',
        type:'post',
        async:false,
        success:function(data) {
            result = data.result;
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
    return result;
}