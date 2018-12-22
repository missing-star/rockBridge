var vm = new Vue({
    el:'#app',
    data:{
        recordList:[
            {
                id:0,
                shopNo:123456,
                status:0,
                statusName:'已完成',
                title:'标题',
                dateTime:'2018.12.12  12:00:00',
                charge:200
            },
            {
                id:1,
                shopNo:123456,
                status:1,
                statusName:'已拒绝',
                title:'标题',
                dateTime:'2018.12.12  12:00:00'
            },
            {
                id:2,
                shopNo:123456,
                status:2,
                statusName:'指派中',
                title:'标题',
                dateTime:'2018.12.12  12:00:00'
            }
        ]
    },
    methods:{
        goRepair() {
            mui.openWindow({
                url:'online-repair.html'
            })
        },
        getRecordDetail(id) {
            mui.openWindow({
                url:'my-repair.html'
            })
        }
    }
})