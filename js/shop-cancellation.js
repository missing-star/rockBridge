var vm = new Vue({
    el: '#app',
    data: {
        quesDesc: '',
        inputCount: 0,
        uploadedImgs: []
    },
    methods: {
        limitLength() {
            this.quesDesc = this.quesDesc.slice(0, 200);
            this.inputCount = this.quesDesc.length;
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        deleteImg(index) {
            this.uploadedImgs.splice(index, 1);
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

        $(this).parent().next().show();
        fr.onload = function () {
            vm.uploadedImgs.push(this.result);
            //置空文件上传框的值
            $('input.upload-input').val("");
        };
    });
});