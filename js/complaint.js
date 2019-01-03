var vm = new Vue({
    el: '#app',
    data: {
        inputContent: '',
        uploadedImgs: [],
        currentTab:'proposal'
    },
    methods: {
        limitLength() {
            this.inputContent = this.inputContent.substring(0, 200);
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        deleteImg(index) {
            this.uploadedImgs.splice(index, 1);
        },
    }
});

$(function () {
    //大分类点击
    $("div.classify-item").click(function () {
        if (!$(this).hasClass('active')) {
            vm.currentTab = $(this).attr('data-type');
            var index = Array.prototype.slice.call(document.querySelectorAll('div.classify-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('ul.ques-classify').eq(index).addClass('active');
            $('ul.ques-classify').eq(index).siblings().removeClass('active');
        }
    });
    // 小分类点击
    $("li.ques-item").click(function () {
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

function uploadImg(elem) {
    $(elem).find('input').click();
}