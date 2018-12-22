new Vue({
    el:'#app',
    data:{
        paidList:[1]
    },
    methods:{
        getDetail(id) {
            mui.openWindow({
                url:'pay-detail-detail.html'
            })
        },
        getInvoice() {
            //发票
            mui.openWindow({
                url:'apply-invoice.html'
            })
        }
    }
});