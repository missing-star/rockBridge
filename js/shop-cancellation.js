var vm = new Vue({
    el: '#app',
    data: {
        quesDesc: '',
        inputCount: 0,
        uploadedImgs: []
    },
    methods: {
        limitLength() {
            this.quesDesc = this.quesDesc.replace(/\s+/g, "").slice(0, 200);
            this.inputCount = this.quesDesc.length;
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        deleteImg(index) {
            this.uploadedImgs.splice(index, 1);
        },
        submitForm() {
            if (this.quesDesc.length == 0) {
                mui.toast('请输入注销原因!');
                return;
            }
            var imgs = this.uploadedImgs.map(function (item) {
                return item.realPath;
            });
            //提交注销
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: `${rootUrl}/index/api/getCancelShop`,
                data: {
                    repulse_content: vm.quesDesc,
                    images: imgs.join(',')
                },
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        sessionStorage.clear();
                        setTimeout(function () {
                            mui.openWindow({
                                url: 'user.html'
                            });
                        }, 200);
                    }else if (data.status == 202) {
                        goLogin();
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
    $('li.cause-item').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
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
        fr.onload = function () {
            uploadImgRealPath(imgObj, this.result);
            //置空文件上传框的值
            $('input.upload-input').val("");
        };
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
            if (data.status == 1) {
                //设置文件路径为服务器路径
                vm.uploadedImgs.push({
                    src: src,
                    realPath: data.result
                });
            }else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}