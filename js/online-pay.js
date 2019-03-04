if(!sessionStorage.getItem('user')) {
    getUserInfo();
}
var vm = new Vue({
    el: '#app',
    data: {
        selectedClassify: '',
        selectedId: '',
        //户号
        userNum: JSON.parse(sessionStorage.getItem('user')).shops.shop_code,
        //需要交纳的费用
        money: '',
        //支付费率
        payFate: 0,
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
        selectedShopAddress: '',
        //地址id
        selectedShopAddressId: '',
        str: '',
        //是否已经获取过报修列表
        isGetList: false,
        isDisabled: getParams().type == 1 ? true : false,
        id:''
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
            } else if (this.selectedId != 0 && this.selectedShopAddressId == '') {
                mui.toast('请选择商铺地址！');
                return false;
            } else if (!parseFloat(this.inputMoney) || this.inputMoney == '') {
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
                address_id: this.selectedShopAddressId
            };
            if (this.selectedRepairId != '') {
                formData.pay_order = this.selectedRepairId;
            }
            $.ajax({
                url: `${rootUrl}/index/api/getAddPayCharge`,
                type: 'post',
                data: formData,
                async: false,
                dataType: 'json',
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        vm.payOrder = data.result.pay_order;
                        //获取信息
                        getInfo();
                    } else if (data.status == 202) {
                        goLogin();
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
        if (vm.isDisabled) {
            vm.selectedClassify = '报修单缴费';
            vm.selectedId = 0;
            vm.money = '';
            vm.inputMoney = '';
            vm.isShowRepair = true;
            getRepairRecord();
            return;
        }
        //电费类型选择
        jQuery.ajax({
            url: 'http://dieshiqiao.pzhkj.cn/index/api/getPayCate',
            dataType: 'json',
            type: 'post',
            success: function (data) {
                if (data.status == 1) {
                    //缴费类型picker
                    var classifyPicker = new $.PopPicker();
                    //商铺地址picker
                    var addressPicker = new $.PopPicker();
                    var list = [{
                        value: 0,
                        text: '报修单缴费',
                        money: 0
                    }];
                    var addList = [];
                    for (key in data.result.pay_category) {
                        list.push({
                            value: data.result.pay_category[key].id,
                            text: data.result.pay_category[key].name,
                            money: data.result.pay_category[key].pay_money
                        });
                    };
                    for (key in data.result.property_address) {
                        addList.push({
                            value: data.result.property_address[key].id,
                            text: data.result.property_address[key].province + data.result.property_address[key].city + data.result.property_address[key].area + data.result.property_address[key].address
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
                                if (!vm.isGetList) {
                                    getRepairRecord();
                                }
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
                } else if (data.status == 202) {
                    goLogin();
                }
            },
            error: function () {
                mui.toast('服务器异常！');
            }

        })
    });
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
            vm.payFate = items[0].fate;
            vm.payWay = items[0].text;
        });
    }, false);
    payPicker.pickers[0].setSelectedIndex(0);
    payPicker.pickers[0].items.forEach(function (pay, index) {
        if(index == 0) {
            vm.id = pay.id;
            vm.payFate = pay.service_price;
            vm.payWay = pay.text;
        }
    });
    
})(mui, document);

function getRepairRecord() {
    $.ajax({
        url: `${rootUrl}/index/api/getMyPayOrder`,
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if (data.status == 1) {
                vm.isGetList = true;
                var list = [];
                var repairPicker = new mui.PopPicker();
                for (key in data.result) {
                    list.push({
                        id:data.result[key].id,
                        value: data.result[key].re_code,
                        text: data.result[key].re_code,
                        money: data.result[key].re_money
                    });
                };
                repairPicker.setData(list);
                var eventBtn = document.getElementById('repair-list');
                eventBtn.addEventListener('tap', function (event) {
                    repairPicker.show(function (items) {
                        vm.id = items[0].id;
                        vm.selectedRepairName = items[0].text;
                        vm.selectedRepairId = items[0].value;
                        vm.money = items[0].money == 0 ? '' : items[0].money;
                        vm.inputMoney = items[0].money == 0 ? '' : items[0].money;
                    });
                }, false);
            } else if (data.status == 202) {
                goLogin();
            }
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
            if(data.status == 1) {
                vm.str = data.info;
            }
            else if (data.status == 202) {
                goLogin();
            }
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
                setTimeout(function () {
                    mui.openWindow({
                        url: 'repair-detail.html?id='+vm.id
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
        async: false,
        success: function (data) {
            if(data.status == 1) {
                result = data.result;
            }
            else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
    return result;
}