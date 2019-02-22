var param = getParams();
var statusName = '';
switch (parseInt(param.status)) {
    case 1:
        statusName = '预约中';
        break;
    case 2:
        statusName = '维修中';
        break;
    case 6:
        statusName = '指派中';
        break;
    case 4:
        statusName = '维修完毕';
        break;
    case 3:
        statusName = '已拒绝';
        break;
}
var vm = new Vue({
    el: '#app',
    data: {
        repairInfo: {
            id: param.id,
            status: param.status,
            order_status: param.order_status,
            shopName: '',
            repairNo: '',
            submitSection: '部门1',
            //1:预约中，2：指派中，3：已拒绝，4：维修完成
            repairStatus: param.status || 1,
            repairStatusName: statusName,
            quesDesc: '',
            cause: '',
            imgs: [],
            submitTime: '',
            isTimeUp: true,
            //倒计时
            remindTime: '',
            needPay: ''
        }
    },
    methods: {
        reminder() {
            //催单
        },
        getShopInfo() {
            //获得商家信息
            mui.openWindow({
                url: 'repair-shop-info.html'
            })
        },
        payOnline() {
            //在线缴费
            mui.confirm('缴费后可进行维修反馈', '缴费成功', ['取消', '确定'], function (e) {
                if (e.index == 0) {
                    //取消
                } else {
                    //确定，去评价
                }
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
            vm.repairInfo.submitTime = data.result.create_at;
            data.result.repait_content_images.forEach(function (item, index) {
                vm.repairInfo.imgs.push(rootUrl + item);
            });
            vm.repairInfo.needPay = data.result.re_money;
            vm.repairInfo.repairNo = data.result.re_code;
            vm.repairInfo.quesDesc = data.result.repair_content;
            vm.repairInfo.shopName = data.result.shop_phone;
            vm.repairInfo.remindTime = countTime(data.result.create_at);
            vm.repairInfo.cause = data.result.refusal_content;
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}