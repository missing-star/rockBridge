var vm = new Vue({
    el: '#app',
    data: {
        inputCount: 0,
        quesDesc: '',
        uploadedImgs: [],
        selectedSection:''
    },
    methods: {
        getRecord() {
            mui.openWindow({
                url:'repair-record.html'
            })
        },
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
        getShopInfo() {
            //获得商家信息
            mui.openWindow({
                url:'repair-shop-info.html'
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
        vm.uploadedImgs.push(this.result);
        //置空文件上传框的值
        $('input.upload-input').val("");
    };
});
//picker组件
(function ($, doc) {
    $.init();
    $.ready(function () {
        console.log(13213);
        //部门选择
        var classifyPicker = new $.PopPicker();
        classifyPicker.setData(['部门1', '部门2']);
        var eventBtn = doc.getElementById('section');
        eventBtn.addEventListener('tap', function (event) {
            classifyPicker.show(function (items) {
                vm.selectedSection = items[0];
            });
        }, false);
    });
})(mui, document);