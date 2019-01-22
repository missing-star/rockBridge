var vm = new Vue({
    el:'#app',
    data:{
        isEditName:false,
        //显示的名称
        title:JSON.parse(localStorage.getItem('user')).shops.title,
        //编辑的名称
        editName:'',
        //头像
        userLogo:JSON.parse(localStorage.getItem('user')).shops.images,
        //电话
        landline:JSON.parse(localStorage.getItem('user')).shops.landline || '',
        //展架数量
        showCounts:JSON.parse(localStorage.getItem('user')).shops.show_goods_num,
        images:'',
        regisiterTime:transformTime(JSON.parse(localStorage.getItem('user')).shops.create_at)
    },
    methods:{
        limitName() {
            this.editName = this.editName.replace(/\s+/g, "");
            this.editName = this.editName.slice(0,8);
        },
        uploadLogo(event) {
            $(event.target).find('input.invisible').click();
        },
        savePhone() {
            if(this.landline.trim().length == 0) {
                mui.toast('请输入电话');
                return;
            }
            if(updateUserInfo()) {
                mui.toast('修改成功');
            }
            else {
                mui.toast('修改失败');
            }
        },
        clearInput() {
            this.editName = '';
        },
        editShopName() {
            this.isEditName = true;
        },
        confirmName() {
            if (this.editName.length != 0) {
                this.title = this.editName;
                if (updateUserInfo()) {
                    mui.toast('修改成功');
                    this.isEditName = false;
                } else {
                    mui.toast('修改失败');
                }
            } else {
                mui.toast('请输入名称!');
            }
        },
        applyCancel() {
            mui.openWindow({
                url:'shop-cancellation.html'
            })
        },
        hideInput() {
            this.isEditName = false;
        },
        buySettles() {
            //购买展架
            mui.openWindow({
                url:'shop-settled.html'
            });
        }
    }
});

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
            } else {
                mui.toast('上传失败');
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
        url: `${rootUrl}/index/api/updateShopsInfo`,
        async: false,
        data: {
            title:vm.title,
            images:vm.images,
            landline:vm.landline
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                result = true;
            } else {
                result = false;
            }
        },
        error: function () {
            result = false;
        }
    });
    return result;
}