var vm = new Vue({
    el: '#app',
    data() {
        return {
            counts: 0,
            goodsName:'',
            description: '',
            goodsPrice: '100.00',
            goodsCounts: 100,
            keywords:'',
            showPriceMsg: '',
            showCountsMsg: '',
            priceOk: true,
            countsOk: true,
            //上传的图片
            uploadedImgs: [],
            isDisabled:true,
            uploadOk:false,
            descriptionOk:false,
            goodsNameOk:false,
            keywordsOk:false
        }
    },
    methods: {
        recordCounts() {
            this.description = this.description.replace(/\s+/g,"");
            this.description = this.description.substring(0, 200);
            this.counts = this.description.length;
        },
        reducePrice() {
            if (this.parseNaN(this.goodsPrice) || parseFloat(this.goodsPrice) <= 0) {
                this.goodsPrice = '1.00';
                return;
            }
            if (parseFloat(this.goodsPrice) - 1 > 0) {
                this.goodsPrice = parseFloat(parseFloat(this.goodsPrice) - 1).toFixed(2);
            }
        },
        addPrice() {
            if (this.parseNaN(this.goodsPrice) || parseFloat(this.goodsPrice) <= 0) {
                this.goodsPrice = '1.00';
                return;
            }
            this.goodsPrice = parseFloat(parseFloat(this.goodsPrice) + 1).toFixed(2);
        },
        reduceCounts() {
            if (this.parseNaN(this.goodsCounts) || parseInt(this.goodsCounts) <= 0) {
                this.goodsCounts = 1;
                return;
            }
            if (parseInt(this.goodsCounts) - 1 > 0) {
                this.goodsCounts = parseInt(this.goodsCounts) - 1;
            }
        },
        addCounts() {
            if (this.parseNaN(this.goodsCounts) || parseInt(this.goodsCounts) <= 0) {
                this.goodsCounts = 1;
                return;
            }
            this.goodsCounts = parseInt(this.goodsCounts) + 1;
        },
        validatePrice() {
            if (!parseFloat(this.goodsPrice) || parseFloat(this.goodsPrice) < 0) {
                this.showPriceMsg = '您输入的价格有误!';
                return false;
            } else {
                this.showPriceMsg = '';
                return true;
            }
        },
        validateCounts() {
            if (!parseInt(this.goodsCounts) || parseInt(this.goodsCounts) <= 0) {
                this.showCountsMsg = '您输入的库存有误!';
                return false;
            } else {
                this.showCountsMsg = '';
                return true;
            }
        },
        parseNaN(value) {
            if (isNaN(parseInt(value)) || isNaN(parseFloat(value))) {
                return true;
            } else {
                return false;
            }
        },
        uploadImg(event) {
            $(event.target).find('input').click();
        },
        limitName() {
            this.goodsName = this.goodsName.replace(/\s+/g,"");
            this.goodsName = this.goodsName.substring(0,20);
        },
        limitKeywords() {
            this.keywords = this.keywords.replace(/\s+/g,"");
        },
        validateAll() {
            if(this.countsOk && this.priceOk && this.goodsNameOk && this.uploadOk && this.descriptionOk) {
                this.isDisabled = false;
            }
            else {
                this.isDisabled = true;
            }
        },
        deleteImg(index) {
            this.uploadedImgs.splice(index, 1);
        },
        submitGoods() {
            var imgs = '';
            for(var i = 0; i < this.uploadedImgs.length; i++) {
                imgs += this.uploadedImgs[i].realPath + ',';
            }
            var formData = {
                act:getParams().type,
                title:this.goodsName,
                g_desc:this.description,
                keywords:this.keywords,
                price:this.goodsPrice,
                nums:this.goodsCounts,
                images:imgs.substring(0,imgs.length - 1)
            }
            $.ajax({
                url:`${rootUrl}/index/api/getShopsGoodsEdit`,
                data:formData,
                type:'post',
                dataType:'json',
                success:function(data) {

                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        }
    },
    watch: {
        goodsPrice() {
            this.priceOk = this.validatePrice();
            this.validateAll();
        },
        goodsCounts() {
            this.countsOk = this.validateCounts();
            this.validateAll();
        },
        uploadedImgs() {
            this.uploadOk = this.uploadedImgs.length > 0 ? true : false;
            this.validateAll();
        },
        goodsName() {
            this.goodsNameOk = this.goodsName.length > 0 ? true : false;
            this.validateAll();
        },
        description() {
            this.descriptionOk = this.description.trim().length > 0 ? true : false;
            this.validateAll();
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
                vm.uploadedImgs = vm.uploadedImgs.concat([{
                    src: src,
                    realPath: data.result
                }]);
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}