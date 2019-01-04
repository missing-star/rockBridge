var vm = new Vue({
    el: '#app',
    data: {
        sex: '',
        city: '',
        birthdate: '',
        address: '',
        userLogo: 'imgs/business-logo.png',
        isEditName: false,
        editName: '',
        nickname: 'Monkey',
        imgObj: ''
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
                this.inputName = this.editName;
                this.isEditName = false;
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
        var classifyPicker = new $.PopPicker();
        classifyPicker.setData(['男', '女']);
        var eventBtn = doc.getElementById('sex');
        eventBtn.addEventListener('tap', function (event) {
            classifyPicker.show(function (items) {
                vm.sex = items[0];
            });
        }, false);
        //日期选择
        var dtPicker = new $.DtPicker({
            "type": "date",
            "beginYear": "1900"
        });
        var birthBtn = document.getElementById('birthdate');
        birthBtn.addEventListener('tap', function () {
            dtPicker.show(function (selectItems) {
                vm.birthdate = selectItems.y.text +
                    '-' + selectItems.m.text + '-' + selectItems.d.text;

            });
        });
        //城市选择
        var _getParam = function (obj, param) {
            return obj[param] || '';
        };
        var cityPicker = new $.PopPicker({
            layer: 3
        });
        cityPicker.setData(cityData);
        var showCityPickerButton = doc.getElementById('address');
        showCityPickerButton.addEventListener('tap', function (event) {
            cityPicker.show(function (items) {
                var selectedCity = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') +
                    " " + _getParam(items[2], 'text');
                vm.address = selectedCity;
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
                //图片上传成功,开始更新个人信息
                if (updateUserInfo()) {
                    mui('#sheet').popover('toggle');
                    vm.userLogo = dataURL;
                }
                else {
                    mui.toast('修改成功');
                }
            } else {
                mui.toast('上传失败');
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}

function updateUserInfo() {

}