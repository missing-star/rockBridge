var vm = new Vue({
    el: '#app',
    data: {
        inputCount: 0,
        quesDesc: '',
        uploadedImgs: []
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
        vm.uploadedImgs.push(this.result);
        //置空文件上传框的值
        $('input.upload-input').val("");
    };
});

$(function() {
    $("div.mask-click").click(function() {
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
    });
});