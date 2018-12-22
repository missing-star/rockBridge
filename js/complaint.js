var vm = new Vue({
    el: '#app',
    data: {
        inputContent: '',
        uploadedImg:''
    },
    methods: {
        limitLength() {
            this.inputContent = this.inputContent.substring(0, 200);
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
    }
});

$(function () {
    //大分类点击
    $("div.mask-click").click(function () {
        if (!$(this).parent().hasClass('active')) {
            var index = Array.prototype.slice.call(document.querySelectorAll('div.mask-click')).indexOf(this);
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            $('div.classify.sub').eq(index).addClass('active');
            $('div.classify.sub').eq(index).siblings().removeClass('active');
        }
    });
    // 小分类点击
    $("div.mask-click-sub").click(function () {
        if (!$(this).parent().hasClass('active')) {
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
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
            vm.uploadedImg = this.result;
            //置空文件上传框的值
            $('input.upload-input').val("");
        };
    });
});

function uploadImg(elem) {
    $(elem).find('input').click();
}