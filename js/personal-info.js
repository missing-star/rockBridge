var vm = new Vue({
    el: '#app',
    data: {
        sex: JSON.parse(sessionStorage.getItem('user')).users.sex,
        sexShow: JSON.parse(sessionStorage.getItem('user')).users.sex == 1 ? '男' : '女',
        city: '',
        birthdate: JSON.parse(sessionStorage.getItem('user')).users.birth_time,
        address: '',
        userLogo: JSON.parse(sessionStorage.getItem('user')).users.images,
        isEditName: false,
        editName: '',
        nickname: JSON.parse(sessionStorage.getItem('user')).users.nickname,
        //文件对象
        imgObj: '',
        //服务器返回的图片路径
        images: '',
        //省市区
        province: '',
        city: '',
        district: ''
    },
    methods: {
        uploadLogo(event) {
            $(event.target).find('input.invisible').click();
        },
        editNickname() {
            this.isEditName = true;
        },
        limitName() {
            this.editName = this.editName.replace(/\s+/g, "");
            this.editName = this.editName.slice(0, 8);
        },
        clearInput() {
            this.editName = '';
        },
        hideInput() {
            this.isEditName = false;
        },
        confirmName() {
            if (this.editName.length != 0) {
                this.nickname = this.editName;
                if (updateUserInfo()) {
                    mui.toast('修改成功');
                    this.isEditName = false;
                } else {
                    mui.toast('修改失败');
                }
            } else {
                mui.toast('请输入名称!');
            }
        }
    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        //性别选择
        var userSex = JSON.parse(sessionStorage.getItem('user')).users.sex;
        var classifyPicker = new $.PopPicker();
        classifyPicker.setData([{
            value: 1,
            text: '男'
        }, {
            value: 0,
            text: '女'
        }]);
        classifyPicker.pickers[0].items.forEach(function(sex,index) {
            if(sex.value == userSex) {
                classifyPicker.pickers[0].setSelectedIndex(index);
            }
        });
        var eventBtn = doc.getElementById('sex');
        eventBtn.addEventListener('tap', function (event) {
            classifyPicker.show(function (items) {
                vm.sex = items[0].value;
                vm.sexShow = items[0].text;
                if(updateUserInfo()) {
                    mui.toast('修改成功');        
                }
                else {
                    mui.toast('修改失败');
                }
            });
        }, false);
        //日期选择
        var dtPicker = new $.DtPicker({
            "type": "date",
            "beginYear": "1900",
            "value": vm.birthdate
        });
        var birthBtn = document.getElementById('birthdate');
        birthBtn.addEventListener('tap', function () {
            dtPicker.show(function (selectItems) {
                vm.birthdate = selectItems.y.text +
                    '-' + selectItems.m.text + '-' + selectItems.d.text;
                if (updateUserInfo()) {
                    mui.toast('修改成功');
                } else {
                    mui.toast('修改失败');
                }
            });
        });
        //城市选择
        var _getParam = function (obj, param) {
            return obj[param] || '';
        };
        var cityPicker = new $.PopPicker({
            layer: 3
        });
        //设置默认选中的城市
        cityPicker.setData(cityData);
        var userProvince = parseInt(JSON.parse(sessionStorage.getItem('user')).users.province);
        var userCity = parseInt(JSON.parse(sessionStorage.getItem('user')).users.city);
        var userDistrict = parseInt(JSON.parse(sessionStorage.getItem('user')).users.district);
        cityPicker.pickers[0].setSelectedValue(userProvince);
        cityPicker.pickers[0].items.forEach(function (provice, index) {
            if (provice.value == userProvince) {
                vm.address += provice.text;
            }
        });
        cityPicker.getSelectedItems()[0].children.forEach(function (city, index) {
            if (userCity == city.value) {
                cityPicker.pickers[1].setSelectedIndex(index);
                vm.address += " " + city.text;
                city.children.forEach(function (district, i) {
                    if (userDistrict == district.value) {
                        vm.address += " " + district.text;
                        cityPicker.pickers[2].setSelectedIndex(i);
                    }
                });
            }
        });
        var showCityPickerButton = doc.getElementById('address');
        showCityPickerButton.addEventListener('tap', function (event) {
            cityPicker.show(function (items) {
                var selectedCity = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') +
                    " " + _getParam(items[2], 'text');
                vm.address = selectedCity;
                vm.province = _getParam(items[0], 'value');
                vm.city = _getParam(items[1], 'value');
                vm.district = _getParam(items[2], 'value');
                if (updateUserInfo()) {
                    mui.toast('修改成功');
                } else {
                    mui.toast('修改失败');
                }
            });
        }, false);
    });

})(mui, document);


var clipArea = new bjj.PhotoClip("#clipArea", {
    size: [260, 260],
    outputSize: [640, 640],
    file: "#file",
    view: "#view",
    ok: "#confirm-btn",
    loadStart: function (files) {
        vm.imgObj = files;
        $("#wait-loading").css("display", "flex");
    },
    loadComplete: function () {
        $("#wait-loading").css("display", "none");
        mui('#sheet').popover('toggle');
    },
    clipFinish: function (dataURL) {
        $("#wait-loading").css("display", "flex");
        //上传图片
        uploadImgRealPath(vm.imgObj, dataURL);
    }
});
//关闭actionsheet
function closeSheet() {
    mui('#sheet').popover('toggle');
}
//保存头像
function saveImg() {
    console.log('111');
}

function uploadImgRealPath(fileObj, dataURL) {
    var formData = new FormData();
    formData.append('image', fileObj);
    $.ajax({
        url: 'http://dieshiqiao.pzhkj.cn/index/Uploadify/api_imgUp',
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
            mui.toast(data.msg);
            if (data.status == 1) {
                vm.images = data.result;
                //图片上传成功,开始更新个人信息
                if (updateUserInfo()) {
                    $("#wait-loading").css("display", "none");
                    mui('#sheet').popover('toggle');
                    vm.userLogo = dataURL;
                } else {
                    mui.toast('修改失败');
                }
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}
/**
 * 更新个人信息
 */
function updateUserInfo() {
    var result = false;
    $.ajax({
        url: `${rootUrl}/index/api/updateUserInfo`,
        async: false,
        data: {
            nickname: vm.nickname,
            images: vm.images,
            sex: vm.sex,
            birth_time: vm.birthdate,
            province: vm.province,
            city: vm.city,
            district: vm.district
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                result = true;
            } 
            else if (data.status == 202) {
                goLogin();
            }
            else {
                result = false;
            }
        },
        error: function () {
            result = false;
        }
    });
    return result;
}
