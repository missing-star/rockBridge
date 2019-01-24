const vm = new Vue({
    el: '#app',
    data() {
        return {
            addressPub:'',
            renting:{
                realPath:'',
                src:''
            }
        }
    },
    methods: {
        uploadRent() {
            //上传租房合同
            $("#renting").click();
        },
        submit() {

        }
    }
});

$(function () {
    $("#renting").change(function () {
        parseImage(this, 'renting');
    });
    initPicker();
});

/**
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
        uploadImgRealPath(imgObj, key, this.result);
        //置空文件上传框的值
        $(elem).val("");
    };
}
//上传图片到后台
function uploadImgRealPath(fileObj, key, src) {
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
                vm.cardList[key].src = src;
                //设置文件路径为服务器路径
                vm.cardList[key].realPath = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}

function initPicker() {
    var addressPicker = new mui.PopPicker();
    addressPicker.setData([
        {
            value:1,
            text:'地址1'
        },
        {
            value:2,
            text:'地址2'
        }
    ]);
    var addressClickBtn = document.getElementById('address-public-shop');
    addressClickBtn.addEventListener('tap', function (event) {
        addressPicker.show(function (items) {
            vm.addressPubId = items[0].id;
            vm.addressPub = items[0].text;
        });
    }, false);
}