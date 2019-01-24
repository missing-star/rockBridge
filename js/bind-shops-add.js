const vm = new Vue({
    el: '#app',
    data() {
        return {
            addressPub: '',
            addressPubId: '',
            renting: {
                realPath: '',
                src: ''
            }
        }
    },
    methods: {
        uploadRent() {
            //上传租房合同
            $("#renting").click();
        },
        submit() {
            if (vm.addressPub == '') {
                mui.toast('请选择地址');
                return false;
            } else if (vm.renting.realPath == '') {
                mui.toast('请上传租房合同');
                return false;
            }
            //提交绑定商铺
            $.ajax({
                url: `${rootUrl}/index/api/getBindingAddress`,
                type: 'post',
                dtaType: 'json',
                data: {
                    id: vm.addressPubId,
                    lease: vm.renting.realPath
                },
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        setTimeout(function () {
                            history.go(-1);
                        }, 200);
                    }
                },
                error: function () {
                    mui.toast('服务器异常');
                }
            });
        }
    }
});

$(function () {
    $("#renting").change(function () {
        parseImage(this, 'renting');
    });
    if (getParams().type == 'edit') {
        getSopsDetail();
    } else {
        initPicker();
    }
});

/**
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
        uploadImgRealPath(imgObj, key, this.result);
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
            if (data.status == 1) {
                vm.renting.src = src;
                //设置文件路径为服务器路径
                vm.renting.realPath = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}

function initPicker() {
    jQuery.ajax({
        url: 'http://dieshiqiao.pzhkj.cn/index/api/getShopAddress',
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            //公房商户选择地址
            var addressPicker = new mui.PopPicker();
            data.result = data.result.map(function (item, index) {
                return {
                    id: item.id,
                    text: item.address
                }
            });
            addressPicker.setData(data.result);
            addressPicker.pickers[0].items.forEach(function(address,index) {
                if(address.value == userSex) {
                    addressPicker.pickers[0].setSelectedIndex(index);
                }
            });
            var addressClickBtn = document.getElementById('address-public-shop');
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
}

function getSopsDetail() {
    $.ajax({
        url: `${rootUrl}/index/api/getAddressInfo`,
        data: {
            id: getParams().id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            vm.shopsInfo = data.result;
            initPicker();
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}