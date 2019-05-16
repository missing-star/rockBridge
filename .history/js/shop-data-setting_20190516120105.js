var vm = new Vue({
    el: '#app',
    data: {
        updateForm: new FormData(),
        isEditName: false,
        //显示的名称
        title: JSON.parse(sessionStorage.getItem('user')).shops.title,
        //编辑的名称
        editName: '',
        //负责人
        person_name: JSON.parse(sessionStorage.getItem('user')).shops.person_name,
        //电话
        landline: JSON.parse(sessionStorage.getItem('user')).shops.landline || '',
        //展架数量
        showCounts: JSON.parse(sessionStorage.getItem('user')).shops.show_goods_num,
        images: '',
        regisiterTime: transformTime(JSON.parse(sessionStorage.getItem('user')).shops.create_at),
        cardList: {
            //头像
            userLogo: {
                src: JSON.parse(sessionStorage.getItem('user')).shops.images,
                realPath: JSON.parse(sessionStorage.getItem('user')).shops.images
            },
            //国徽面
            emblem: {
                src: JSON.parse(sessionStorage.getItem('user')).shops.idcard.split(',')[0],
                realPath: JSON.parse(sessionStorage.getItem('user')).shops.idcard.split(',')[0]
            },
            //人像面
            portrait: {
                src: JSON.parse(sessionStorage.getItem('user')).shops.idcard.split(',')[1],
                realPath: JSON.parse(sessionStorage.getItem('user')).shops.idcard.split(',')[1]
            },
            //营业执照
            license: {
                src: JSON.parse(sessionStorage.getItem('user')).shops.business_license,
                realPath: JSON.parse(sessionStorage.getItem('user')).shops.business_license
            }
        },
        // 微信号
        customer_service:''
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        uploadWechatCode() {
            // 上传微信二维码
            $("#wechat").click();
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
        limitName() {
            this.editName = this.editName.replace(/\s+/g, "");
            this.editName = this.editName.slice(0, 8);
        },
        uploadLogo(event) {
            $(event.target).find('input.invisible').click();
        },
        savePhone() {
            if (this.landline.trim().length == 0) {
                mui.toast('请输入电话');
                return;
            }
            vm.updateForm.append('landline', this.landline);
            if (updateUserInfo()) {
                mui.toast('修改成功');
            } else {
                mui.toast('修改失败');
            }
        },
        savePerseonName() {
            if (this.person_name.trim().length == 0) {
                mui.toast('请输入名称');
                return;
            }
            vm.updateForm.append('person_name', vm.person_name);
            if (updateUserInfo()) {
                mui.toast('修改成功');
            } else {
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
                vm.updateForm.append('title', this.title);
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
        saveEditInfo() {
            if (this.person_name.trim().length == 0) {
                mui.toast('请输入名称');
                return;
            }
            vm.updateForm.append('person_name', vm.person_name);
            if (this.landline.trim().length == 0) {
                mui.toast('请输入电话');
                return;
            }
            vm.updateForm.append('landline', this.landline);
            if(this.customer_service.trim().length == 0) {
                mui.toast('请输入微信号');
                return;
            }
            vm.updateForm.append('customer_service',vm.customer_service);
        },
        applyCancel() {
            mui.openWindow({
                url: 'shop-cancellation.html'
            })
        },
        hideInput() {
            this.isEditName = false;
        },
        buySettles() {
            //购买展架
            mui.openWindow({
                url: 'shop-settled.html'
            });
        },
        managerGoods() {
            mui.openWindow({
                url:'goods-management.html'
            })
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
        uploadImgRealPath(dataURLtoFile(dataURL, vm.imgObj.name), dataURL, 'userLogo');
    }
});
//关闭actionsheet
function closeSheet() {
    mui('#sheet').popover('toggle');
}
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
        uploadImgRealPath(imgObj, null, key);
        //置空文件上传框的值
        $(elem).val("");
    };
}
/**
 * 
 * @param {object} fileObj 图片对象 
 * @param {string} dataURL base64图片格式 
 * @param {string} key 上传的分类 
 */
function uploadImgRealPath(fileObj, dataURL, key) {
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
                switch (key) {
                    case 'userLogo':
                        vm.updateForm.append('images', data.result);
                        if (updateUserInfo()) {
                            vm.cardList[key].realPath = vm.cardList[key].src = data.result;
                            $("#wait-loading").css("display", "none");
                            mui('#sheet').popover('toggle');
                            vm.userLogo = dataURL;
                        } else {
                            mui.toast('修改失败');
                        }
                        break;
                    case 'license':
                        vm.updateForm.append('business_license', data.result);
                        if (updateUserInfo()) {
                            vm.cardList[key].realPath = vm.cardList[key].src = data.result;
                        } else {
                            mui.toast('修改失败');
                        }
                        break;
                    case 'emblem':
                        //国徽
                        vm.updateForm.append('idcard', data.result + ',' + vm.cardList.portrait.realPath);
                        if (updateUserInfo()) {
                            vm.cardList.portrait.emblem = vm.cardList.emblem.src = data.result;
                        } else {
                            mui.toast('修改失败');
                        }
                        break;
                    case 'portrait':
                        // 人像
                        vm.updateForm.append('idcard', vm.cardList.emblem.realPath + ',' + data.result);
                        if (updateUserInfo()) {
                            vm.cardList.portrait.realPath = vm.cardList.portrait.src = data.result;
                        } else {
                            mui.toast('修改失败');
                        }
                        break;
                    case 'wechat':
                    // 微信二维码
                    vm.updateForm.append('customer_service_image',data.result);
                    if (updateUserInfo()) {
                        mui.toast('上传成功');
                    } else {
                        mui.toast('修改失败');
                    }
                    break;
                }

            } else if (data.status == 202) {
                goLogin();
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
        contentType: false,
        processData: false,
        data: vm.updateForm,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                result = true;
            } else if (data.status == 202) {
                goLogin();
            } else {
                result = false;
            }
        },
        error: function () {
            result = false;
        }
    });
    vm.updateForm = new FormData();
    if(result) {
        getUserInfo();
    }
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
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    return new File([u8arr], filename, {
        type: mime
    });
}

$(function () {
    //监听图片上传
    $('#emblem').change(function () {
        parseImage(this, 'emblem');
    });
    $("#license").change(function () {
        parseImage(this, 'license');
    });
    $("#portrait").change(function () {
        parseImage(this, 'portrait');
    });
    $('#wechat').change(function() {
        parseImage(this,'wechat');
    });
});
