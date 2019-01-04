var vm = new Vue({
    el: '#app',
    data: {
        //用户名
        userName: '',
        //公房地址选择
        addressPubId: '',
        addressPub: '',
        otherCitySelected: '',
        phone: '',
        password: '',
        //手机号是否注册
        isRegister: true,
        //是否为公房商户
        isPub: true,
        //详细地址
        detailAddress: '',
        //控制选择器实例化，防止多次实例化
        addressPicker: false,
        cityPicker: false,
        //省市区
        province: '',
        city: '',
        district: '',
        cardList: {
            emblem: {
                src: 'imgs/id-card-1.png',
                realPath: ''
            },
            portrait: {
                src: 'imgs/id-card-2.png',
                realPath: ''
            },
            license: {
                src: '',
                realPath: ''
            },
            renting: {
                src: '',
                realPath: ''
            },
            other: {
                src: '',
                realPath: ''
            }
        }
    },
    methods: {
        limitPhone() {
            var regPhone = /^1[34578]\d{9}$/;
            this.phone = this.phone.substring(0, 11);
            if (regPhone.test(this.phone)) {
                //手机号验证通过，请求接口是否已注册
                $.ajax({
                    url: 'http://dieshiqiao.pzhkj.cn/index/api/getAddShopVerify',
                    data: {
                        phone: this.phone
                    },
                    dataType: 'json',
                    type: 'post',
                    success: function (data) {
                        if (data.status == 1) {
                            vm.isRegister = true;
                        } else {
                            vm.isRegister = false;
                        }
                    },
                    error: function () {

                    }
                });
            } else {
                vm.isRegister = true;
            }
        },
        limitPassword() {
            this.password = this.password.substring(0, 18);
        },
        uploadEmblem() {
            //上传国徽面
            $("#emblem").click();
        },
        uploadPortrait() {
            //上传人像面
            $("#portrait").click();
        },
        uploadLicense() {
            //上传营业执照
            $("#license").click();
        },
        uploadRent() {
            //上传租房合同
            $("#renting").click();
        },
        uploadOther() {
            //上传其他材料
            $("#other").click();
        },
        validateName() {
            //限制用户名
            this.userName = this.userName.replace(/\s+/g, "");
            this.userName = this.userName.slice(0, 6);
        },
        limitAddress() {
            //限制详细地址
            this.detailAddress = this.detailAddress.replace(/\s+/g, "");
        },
        submit() {
            var regPhone = /^1[34578]\d{9}$/;
            var formData = {
                person_name: this.userName,
                phone: this.phone,
                password: this.password,
                address_id: this.addressPubId,
                address: this.detailAddress,
                idcard: this.cardList.emblem.realPath + ',' + this.cardList.portrait.realPath,
                business_license: this.cardList.license.realPath,
                lease: this.cardList.renting.realPath,
                type: this.isPub ? 1 : 2,
                province: vm.province,
                city: vm.city,
                district: vm.district
            };
            if (formData.person_name == '') {
                mui.toast('请输入商户名！');
                return false;
            } else if (!regPhone.test(formData.phone)) {
                mui.toast('手机号有误！');
                return false;
            } else if (!vm.isRegister && formData.password.length < 6) {
                mui.toast('请输入6-18位密码！');
                return false;
            } else if ((vm.isPub && formData.address_id == '') || (!vm.isPub && (formData.address == '' || formData.province == ''))) {
                mui.toast('地址有误！');
                return false;
            } else if (this.cardList.emblem.realPath == '' || this.cardList.portrait.realPath == '') {
                mui.toast('请上传身份证正反两面！');
                return false;
            }
            $.ajax({
                url: 'http://dieshiqiao.pzhkj.cn/index/api/getAddShop',
                type: 'post',
                dataType: 'json',
                data: formData,
                success: function (data) {
                    if (data.status == 1) {
                        mui.confirm('资料已提交成功', '', ['确定'], function (e) {
                            window.location.reload();
                            //可以进行切换
                            localStorage.setItem('switchRole', 1);
                        });
                    } else {
                        mui.toast(data.msg);
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            })
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
    //监听图片上传
    $('#emblem').change(function () {
        parseImage(this, 'emblem');
    });
    $('#portrait').change(function () {
        parseImage(this, 'portrait');
    });
    $("#renting").change(function () {
        parseImage(this, 'renting');
    });
    $("#license").change(function () {
        parseImage(this, 'license');
    });
    $("#other").change(function () {
        parseImage(this, 'other');
    });
});
/**
 * 
 * @param {String} elem 
 * @param {String} key 
 * 处理图片图片
 */
function parseImage(elem, key) {
    var filePath = $(elem).val(); //读取图片路径
    var fr = new FileReader(); //创建new FileReader()对象
    var imgObj = elem.files[0]; //获取图片
    fr.readAsDataURL(imgObj); //将图片读取为DataURL
    var arr = filePath.split('\\');
    var fileName = arr[arr.length - 1];
    fr.onload = function () {
        uploadImgRealPath(imgObj, key, this.src);
        //置空文件上传框的值
        $(elem).val("");
    };
}
//上传图片到后台
function uploadImgRealPath(fileObj, key, src) {
    var formData = new FormData();
    formData.append('image', fileObj);
    $.ajax({
        url: 'http://dieshiqiao.pzhkj.cn/index/Uploadify/api_imgUp',
        type: 'post',
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
            mui.toast(data.msg);
            if (dta.status == 1) {
                vm.cardList[key].src = src;
                //设置文件路径为服务器路径
                vm.cardList[key].realPath = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}

function initPicker() {
    (function ($, doc) {
        $.init();
        $.ready(function () {
            if (vm.isPub && !vm.addressPicker) {
                jQuery.ajax({
                    url: 'http://dieshiqiao.pzhkj.cn/index/api/getShopAddress',
                    dataType: 'json',
                    type: 'POST',
                    success: function (data) {
                        vm.addressPicker = true;
                        //公房商户选择地址
                        var addressPicker = new $.PopPicker();
                        data.result = data.result.map(function (item, index) {
                            return {
                                id: item.id,
                                text: item.address
                            }
                        });
                        addressPicker.setData(data.result);
                        var addressClickBtn = doc.getElementById('address-public-shop');
                        addressClickBtn.addEventListener('tap', function (event) {
                            addressPicker.show(function (items) {
                                vm.addressPubId = items[0].id;
                                vm.addressPub = items[0].text;
                            });
                        }, false);
                    },
                    error: function () {
                        mui.toast('获取地址异常!');
                    }
                });
            } else if (!vm.cityPicker) {
                vm.cityPicker = true;
                //其他商户选择省市区
                var _getParam = function (obj, param) {
                    return obj[param] || '';
                };
                var cityPicker = new $.PopPicker({
                    layer: 3
                });
                cityPicker.setData(cityData);
                var showCityPickerButton = doc.getElementById('address-public-other');
                var cityResult = doc.getElementById('address-public-other');
                showCityPickerButton.addEventListener('tap', function (event) {
                    cityPicker.show(function (items) {
                        vm.province = _getParam(items[0], 'value');
                        vm.city = _getParam(items[1], 'value');
                        vm.district = _getParam(items[2], 'value');
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