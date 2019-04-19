var vm = new Vue({
    el: '#app',
    data: {
        inputContent: '',
        uploadedImgs: [],
        currentTab: 'proposal',
        type: 1
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
        submitComplain() {
            var imgs = this.uploadedImgs.map(function (item) {
                return item.realPath;
            });
            $.ajax({
                url: `${rootUrl}/index/api/getComplain`,
                type: 'post',
                data: {
                    type: vm.type,
                    content: vm.inputContent,
                    images: imgs.join(',')
                },
                dataType: 'json',
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        setTimeout(function () {
                            history.go(-1);
                        }, 200);
                    } else if (data.status == 202) {
                        goLogin();
                    }
                    vm.commentsInfo = data.result;
                },
                error: function () {
                    mui.toast('服务器异常');
                }
            })
        }
    }
});

$(function () {
    //大分类点击
    $("div.classify-item").click(function () {
        if (!$(this).hasClass('active')) {
            vm.currentTab = $(this).attr('data-type');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.type = vm.currentTab == 'proposal' ? 1 : 2;
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
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常!');
        }
    })
}


function initPicker(elemId,title,pickerName) {
    [pickerName] = new mui.PopPicker({
        title: title
    });
    var data = getSectionList().map(function (item) {
        return {
            value: item.role_id,
            text: item.role_name
        }
    });
    numberPicker.setData(data);
    var eventBtn = doc.getElementById(elemId);
    eventBtn.addEventListener('tap', function (event) {
        numberPicker.show(function (items) {
            if (!items[2].value) {
                mui.toast('无效地址!');
                return false;
            }
            vm.selectedId = items[2].value;
            vm.selectedNumber = items[0].text + items[1].text + items[2].text;
            getNotActivdShops(vm.selectedId);
        });
    }, false);
}
/**
 * 获得部门列表
 */
function getSectionList() {
    var res = '';
    $.ajax({
        url:`${rootUrl}/index/api/getComplainRole`,
        type:'post',
        dataType:'json',
        async:false,
        success:function(data) {
            if(data.status == 1) {
                res = data.result;   
            }
            else {
                mui.toast(data.msg);
            }
        }
    })
    return res;
}

initPicker('choose-section','选择部门');