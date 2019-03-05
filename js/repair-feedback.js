var param = getParams();
var vm = new Vue({
    el: '#app',
    data: {
        inputCount: 0,
        quesDesc: '',
        uploadedImgs: [],
        serviceComm: 1
    },
    methods: {
        limitLength() {
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
        submitQues() {
            const images = this.uploadedImgs.map(function(img,index) {
                return img.realPath + ',';
            });
            var formData = {
                repair_id: param.repair_id,
                repair_review_status: param.repair_review_status,
                repair_revire_content: this.quesDesc,
                revire_service: this.serviceComm,
                images: images.substring(0,images.length - 1)
            }
            console.log(this.serviceComm);
            console.log(formData);
            $.ajax({
                url: `${rootUrl}/index/api/getAddRepairReview`,
                type: 'post',
                dataType: 'json',
                data: formData,
                success: function (data) {
                    if (data.status == 1) {
                        mui.confirm('反馈已提交！', '', ['确定'], function (e) {
                           history.go(-1);
                        });
                    } else if(data.status == 202) {
                        goLogin();
                    }
                    else {
                        mui.toast('提交失败');
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            })
        }
    }
});
//监听图片上传
$('input.upload-input').change(function () {

    var filePath = $(this).val(); //读取图片路径

    var fr = new FileReader(); //创建new FileReader()对象
    var imgObj = this.files[0]; //获取图片

    fr.readAsDataURL(imgObj); //将图片读取为DataURL


    var arr = filePath.split('\\');
    var fileName = arr[arr.length - 1];

    $(this).parent().next().show();
    fr.onload = function () {
        uploadImgRealPath(imgObj, this.result);
        //置空文件上传框的值
        $('input.upload-input').val("");
    };
});

$(function () {
    $("li.service-item").click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        vm.serviceComm = $(this).attr('data-service');
    });
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
            //设置文件路径为服务器路径
            if (data.status == 1) {
                vm.uploadedImgs.push({
                    src: src,
                    realPath: data.result
                });
            }else if(data.status == 202) {
                goLogin(param.type);
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}