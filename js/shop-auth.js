var vm = new Vue({
    el: '#app',
    data: {
        addressPub: '',
        otherCitySelected: '',
        phone:'',
        //是否为公房商户
        isPub: true,
        //控制选择器实例化，防止多次实例化
        addressPicker: false,
        cityPicker: false
    },
    methods: {
        limitPhone() {
            this.phone = this.phone.substring(0,11);
        }
    },
    watch: {
        isPub: function () {
            this.$nextTick(function () {
                initPicker();
            });
        }
    }
});

$(function () {
    $('li.tab-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.isPub = $(this).attr('data-shop-id') == 0 ? true : false;
        }
    });
});


function initPicker() {
    (function ($, doc) {
        $.init();
        $.ready(function () {
            if (vm.isPub && !vm.addressPicker) {
                vm.addressPicker = true;
                //公房商户选择地址
                var addressPicker = new $.PopPicker();
                addressPicker.setData(['地址1', '地址2']);
                var addressClickBtn = doc.getElementById('address-public-shop');
                addressClickBtn.addEventListener('tap', function (event) {
                    console.log('第一个');
                    addressPicker.show(function (items) {
                        vm.addressPub = items[0];
                    });
                }, false);
            } else if (!vm.cityPicker) {
                vm.cityPicker = true;
                //其他商户选择省市区
                var _getParam = function (obj, param) {
                    return obj[param] || '';
                };
                var cityPicker = new $.PopPicker({
                    layer: 3
                });
                console.log(cityData);
                cityPicker.setData(cityData);
                var showCityPickerButton = doc.getElementById('address-public-other');
                console.log(showCityPickerButton);
                var cityResult = doc.getElementById('address-public-other');
                showCityPickerButton.addEventListener('tap', function (event) {
                    cityPicker.show(function (items) {
                        var selectedCity = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') +
                            " " + _getParam(items[2], 'text');
                        vm.otherCitySelected = selectedCity;
                    });
                }, false);
            }
        });
    })(mui, document);
}
initPicker();