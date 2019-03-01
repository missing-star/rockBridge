var vm = new Vue({
    el: '#app',
    data: {
        //输入字数
        inputCount: 0,
        //问题描述输入内容
        quesDesc: '',
        //上传的图片
        uploadedImgs: [],
        //选择的部门
        selectedSection: '',
        //报修单号
        repairNo: 12345,
        //商家信息
        shopInfo: '',
        //商家标题加手机号
        shopInfoShow: '',
        //是否显示商家信息
        isShow: false,
        //编辑中的电话
        editPhone: '',
        //显示的电话和提交的电话
        showPhone: '',
        //报修位置
        selectedPosition: '',
        repairTime: '2018-12-26 15:00-16:00',
        repairTitle: ''
    },
    methods: {
        getRecord() {
            mui.openWindow({
                url: 'repair-record.html'
            })
        },
        limitPhone() {
            this.editPhone = this.editPhone.substring(0, 11);
        },
        limitLength() {
            this.quesDesc = this.quesDesc.replace(/\s+/g, "");
            if (this.quesDesc.length <= 300) {
                this.inputCount = this.quesDesc.length;
            } else {
                this.inputCount = 300;
                this.quesDesc = this.quesDesc.substring(0, 300);
            }
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        deleteImg(index) {
            this.uploadedImgs.splice(index, 1);
        },
        showShop() {
            this.isShow = true;
        },
        hideShop() {
            console.log(6660);
            this.isShow = false;
        },
        submitRepair() {
            var imgs = '';
            this.uploadedImgs.forEach(function (img, index) {
                imgs += img.realPath + ',';
            });
            //提交报修
            var formData = {
                shop_phone: this.shopInfo.phone,
                repair_content: this.quesDesc,
                // section: this.selectedSection,
                // question: this.quesDesc,
                repait_content_images: imgs.substring(0, imgs.length - 1),
                repair_title: this.repairTitle
            };
            // if (formData.section == '') {
            //     mui.toast('请选择提交部门！');
            //     return false;
            // }
            $.ajax({
                url: 'http://dieshiqiao.pzhkj.cn/index/api/getAddRepairRecord',
                data: formData,
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data.status == 1) {
                        mui.confirm('报修已提交成功！', '', ['确定'], function (e) {
                            history.go(-1);
                        });
                    } else if (data.status == 202) {
                        goLogin();
                    } else {
                        mui.toast(data.msg);
                    }
                },
                error: function () {

                }
            });
        },
        savePhone() {
            if (!validatePhone(this.editPhone)) {
                mui.toast('手机号不合法');
                return false;
            } else {
                this.showPhone = this.editPhone;
                this.shopInfoShow = this.shopInfo.title + ' ' + this.showPhone;
                this.hideShop();
            }
        }
    }
});
$(function () {
    //监听图片上传
    $('input.upload-input').change(function () {

        var filePath = $(this).val(); //读取图片路径

        var fr = new FileReader(); //创建new FileReader()对象
        var imgObj = this.files[0]; //获取图片

        fr.readAsDataURL(imgObj); //将图片读取为DataURL


        var arr = filePath.split('\\');
        var fileName = arr[arr.length - 1];
        fr.onload = function () {
            uploadImgRealPath(imgObj, this.result);
            //置空文件上传框的值
            $('input.upload-input').val("");
        };
    });
    //获取商家信息
    getShopInfo();
});
//上传图片到后台
function uploadImgRealPath(fileObj, src) {
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
                //设置文件路径为服务器路径
                vm.uploadedImgs.push({
                    src: src,
                    realPath: data.result
                });
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}
//picker组件
// (function ($, doc) {
//     $.init();
//     $.ready(function () {
//         //部门选择
//         var classifyPicker = new $.PopPicker();
//         classifyPicker.setData(['部门1', '部门2']);
//         var eventBtn = doc.getElementById('section');
//         eventBtn.addEventListener('tap', function (event) {
//             classifyPicker.show(function (items) {
//                 vm.selectedSection = items[0];
//             });
//         }, false);
//         //报修位置
//         var positionPicker = new $.PopPicker();
//         positionPicker.setData(['大门', '地板']);
//         var eventBtn = doc.getElementById('repair-position');
//         eventBtn.addEventListener('tap', function (event) {
//             positionPicker.show(function (items) {
//                 vm.selectedPosition = items[0];
//             });
//         }, false);
//     });
// })(mui, document);

function getShopInfo() {
    $.ajax({
        url: 'http://dieshiqiao.pzhkj.cn/index/api/getShopInfo',
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                vm.shopInfo = data.info;
                vm.editPhone = vm.showPhone = data.info.phone;
                vm.shopInfoShow = vm.shopInfo.title + ' ' + vm.showPhone;
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}