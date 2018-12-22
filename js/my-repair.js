var vm = new Vue({
    el: '#app',
    data: {
        repairInfo: {
            shopName: '商家名称',
            repairNo: 12456,
            submitSection: '部门1',
            repairStatus: 4,
            repairStatusName: '指派中',
            quesDesc: '东风科技的康师傅奋达科技飞洒了地方科技',
            cause:'拒绝原因',
            imgs:['imgs/bed1.png','imgs/bed2.png']
        },
        isTimeUp: true
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
            mui.confirm('缴费后可进行维修反馈','缴费成功',['取消','确定'],function(e) {
                if(e.index == 0) {
                    //取消
                }
                else {
                    //确定，去评价
                }
            });
        },
        feedBack() {
            // 维修反馈
            mui.openWindow({
                url: 'repair-feedback.html'
            })
        },
        getRecord() {
            //维修记录
            mui.openWindow({
                url:'repair-record.html'
            })
        }
    }
});