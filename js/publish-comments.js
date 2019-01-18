var vm = new Vue({
    el: '#app',
    data: {
        goodsDescTitle: '',
        productProvideTitle:'',
        shopDescTitle:'',
        //上传的图片
        uploadedImgs: [],
        isDisabled:true
    },
    methods: {
        selectDesc(type,index, event) {
            $(event.target).nextAll().removeClass('active');
            $(event.target).addClass('active');
            $(event.target).prevAll().addClass('active');
            type == 0 ? this.goodsDescTitle = this.getContent(index) : (type == 1 ? this.productProvideTitle = this.getContent(index) : this.shopDescTitle = this.getContent(index));
        },
        getContent(index) {
            var result = '';
            switch (index) {
                case 1:
                    result = '非常差';
                    break;
                case 2:
                    result = '差';
                    break;
                case 3:
                    result = '一般';
                    break;
                case 4:
                    result = '好';
                    break;
                case 5:
                    result = '非常好';
                    break;
            }
            return result;
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        isPublish() {
            if(this.goodsDescTitle != '' && this.productProvideTitle != '' && this.shopDescTitle != '') {
                this.isDisabled = false;
            }
            else {
                this.isDisabled = true;
            }
        },
        selectNoName(event) {
            $(event.target).parent().toggleClass('active');
        }
    },
    watch: {
        //监听三个打分变化
        goodsDescTitle() {
            this.isPublish();
        },
        productProvideTitle() {
            this.isPublish();
        },
        shopDescTitle() {
            this.isPublish();
        }
    },
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
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}