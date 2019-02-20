var vm = new Vue({
    el:'#app',
    data:{
        isEditName:false,
        //显示的名称
        title:JSON.parse(localStorage.getItem('user')).shops.title,
        //编辑的名称
        editName:'',
        //负责人
        person_name:JSON.parse(localStorage.getItem('user')).shops.person_name,
        //电话
        landline:JSON.parse(localStorage.getItem('user')).shops.landline || '',
        //展架数量
        showCounts:JSON.parse(localStorage.getItem('user')).shops.show_goods_num,
        images:'',
        regisiterTime:transformTime(JSON.parse(localStorage.getItem('user')).shops.create_at),
        cardList: {
            //头像
            userLogo:{
                src:JSON.parse(localStorage.getItem('user')).shops.images,
                realPath:JSON.parse(localStorage.getItem('user')).shops.images
            },
            //国徽面
            emblem: {
                src: JSON.parse(localStorage.getItem('user')).shops.idcard.split(',')[0],
                realPath: JSON.parse(localStorage.getItem('user')).shops.idcard.split(',')[0]
            },
            //人像面
            portrait: {
                src: JSON.parse(localStorage.getItem('user')).shops.idcard.split(',')[1],
                realPath: JSON.parse(localStorage.getItem('user')).shops.idcard.split(',')[1]
            },
            //营业执照
            license: {
                src: JSON.parse(localStorage.getItem('user')).shops.business_license,
                realPath:JSON.parse(localStorage.getItem('user')).shops.business_license
            }
        }
    },
    filters:{
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods:{
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
        savePerseonName() {

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
        uploadImgRealPath(dataURLtoFile(dataURL), dataURL);
    }
});
//关闭actionsheet
function closeSheet() {
    mui('#sheet').popover('toggle');
}
function uploadImgRealPath(fileObj, dataURL) {
    console.log(dataURL,fileObj);
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
/**
 * 
 * @param {string} dataurl base64格式图片
 * @param {string} filename 文件名
 */
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length; 
    var u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    return new File([u8arr], filename, {type:mime});
  }