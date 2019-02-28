var param = getParams();
var statusName = '';
//当前用户为维修员还是商户
const isRepairMan = param.type == 1  ? true : false;

var vm = new Vue({
    el: '#app',
    data: {
        isRepairMan: isRepairMan,
        repairInfo: {
            id: param.id,
            status: '',
            order_status: '',
            shopName: '',
            repairNo: '',
            submitSection: '部门1',
            repairStatusName: '',
            quesDesc: '',
            cause: '',
            imgs: [],
            submitTime: '',
            isTimeUp: true,
            //倒计时
            remindTime: '',
            needPay: '',
            payStatus:''
        }
    },
    methods: {
        getShopInfo() {
            //获得商家信息
            mui.openWindow({
                url: 'repair-shop-info.html'
            });
        },
        feedBack() {
            // 维修反馈
            mui.openWindow({
                url: 'repair-feedback.html?repair_id=' + param.id + '&repair_review_status=' + param.order_status
            })
        },
        getRecord() {
            //维修记录
            mui.openWindow({
                url: 'repair-record.html'
            })
        },
        goPay(status, id, order_status) {
            //缴费
            mui.openWindow({
                url: 'online-pay.html?status=' + status + '&id=' + id + '&order_status=' + order_status
            });
        },
        cancelReverse() {
            //取消预约
            mui.prompt('请填写取消原因', '原因', function (e) {
                if (e.index == 1) {
                    if (e.value.trim() != '') {
                        $.ajax({
                            url: `${rootUrl}/index/api/getCancelRepair`,
                            type: 'post',
                            data: {
                                id: param.id,
                                refusal_content: e.value
                            },
                            dataType: 'json',
                            success: function (data) {
                                mui.toast(data.msg);
                                if (data.status == 1) {
                                    //重新拉取数据
                                    getRecordDetail(param.id);
                                }
                            },
                            error: function () {
                                mui.toast('服务器异常！');
                            }
                        });
                    } else {
                        mui.toast('取消原因不可为空!');
                        return false;
                    }
                }
            });
        },
        receiveOrder() {
            //接受报修单
            mui.confirm('确定接受该报修单吗？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getConfirmAssignment`,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        data: {
                            id: param.id
                        },
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                //重新拉取数据
                                getRecordDetail(param.id);
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        refuseOrder() {
            //拒绝报修单
            mui.prompt('请填写拒绝原因', '原因', function (e) {
                if (e.index == 1) {
                    if (e.value.trim() != '') {
                        $.ajax({
                            url: `${rootUrl}/index/api/getRepairmanCancel`,
                            type: 'post',
                            data: {
                                id: param.id,
                                refusal_content: e.value
                            },
                            dataType: 'json',
                            success: function (data) {
                                mui.toast(data.msg);
                                if (data.status == 1) {
                                    //重新拉取数据
                                    getRecordDetail(param.id);
                                }
                            },
                            error: function () {
                                mui.toast('服务器异常！');
                            }
                        });
                    } else {
                        mui.toast('拒绝原因不可为空!');
                        return false;
                    }
                }
            });
        },
        completeOrder() {
            //完成维修
            mui.confirm('确定已完成该报修单？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getUpdateOver`,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        data: {
                            id: param.id
                        },
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                //重新拉取数据
                                getRecordDetail(param.id);
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        setPrice() {
            mui.prompt('请输入金额', '金额', function (e) {
                if (e.index == 1) {
                    var reg = /^\d+(\.\d{0,2})?$/;
                    var result = reg.test(e.value);
                    if (result) {
                        vm.inputMoney = e.value;
                        submitRepair(param.id, e.value);
                    } else {
                        mui.toast('请输入正确的金额！');
                        return false;
                    }
                }
            });
        }
    }
});

$(function () {
    getRecordDetail(param.id);
});

function getRecordDetail(id) {
    $.ajax({
        url: `${rootUrl}/index/api/getRepairRecordInfo`,
        dataType: 'json',
        type: 'post',
        data: {
            id: id
        },
        success: function (data) {
            if (isRepairMan) {
                switch (parseInt(data.result.handle_status)) {
                    case 2:
                        vm.repairInfo.repairStatusName = '待确认';
                        break;
                    case 3:
                        vm.repairInfo.repairStatusName = '维修中';
                        break;
                    case 4:
                        vm.repairInfo.repairStatusName = '已完成';
                        break;
                    case 5:
                        vm.repairInfo.repairStatusName = '已取消';
                        break;
                    case 6:
                        vm.repairInfo.repairStatusName = '已拒绝';
                        break;
                }
            } else {
                switch (parseInt(data.result.handle_status)) {
                    case 1:
                        vm.repairInfo.repairStatusName = '预约中';
                        break;
                    case 2:
                        vm.repairInfo.repairStatusName = '指派中';
                        break;
                    case 3:
                        vm.repairInfo.repairStatusName = '维修中';
                        break;
                    case 4:
                        vm.repairInfo.repairStatusName = '已完成';
                        break;
                    case 5:
                        vm.repairInfo.repairStatusName = '已取消';
                        break;
                    case 6:
                        vm.repairInfo.repairStatusName = '已拒绝';
                        break;
                }
            }
            vm.repairInfo.submitTime = data.result.create_at;
            vm.repairInfo.status = vm.repairInfo.order_status = data.result.handle_status;
            vm.repairInfo.imgs = [];
            data.result.repait_content_images.forEach(function (item, index) {
                vm.repairInfo.imgs.push(rootUrl + item);
            });
            vm.repairInfo.needPay = data.result.re_money;
            vm.payStatus = data.result.type == 0 ? '未支付' : '已支付';
            vm.repairInfo.repairNo = data.result.re_code;
            vm.repairInfo.quesDesc = data.result.repair_content;
            vm.repairInfo.shopName = data.result.title + data.result.shop_phone;
            vm.repairInfo.remindTime = countTime(data.result.create_at);
            vm.repairInfo.cause = data.result.refusal_content;
            //初始化图片预览
            mui.previewImage();
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}


function submitRepair(id, money) {
    $.ajax({
        url: `${rootUrl}/index/api/getUpdateMoney`,
        data: {
            id: id,
            money: money
        },
        type: 'post',
        datType: 'json',
        success: function (data) {
            if (data.status == 1) {
                mui.confirm('提交成功！', '', ['确定'], function (e) {
                    location.reload();
                });
            } else {
                mui.toast(data.msg);
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}