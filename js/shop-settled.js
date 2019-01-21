var vm = new Vue({
    el: '#app',
    data: {
        buyNums:10,
        price:100,
        totalMoney:0,
        isDisabled:false,
        msg:''
    },
    methods: {
        validateNum() {
            if(!parseInt(this.buyNums)) {
                this.isDisabled = true;
                this.msg = '您输入的数量有误';
            }
            else {
                this.msg = '';
                this.totalMoney = this.buyNums*this.price*1.006
                this.isDisabled = false;
            }
        },
        submitOrder() {
            $.ajax({
                url:`${rootUrl}/index/api/displayDopay`,
                type:'post',
                dataType:'json',
                data:{
                    buy_num:vm.buyNums
                },
                success:function(data) {

                }
            });
        }
    },
    created() {
        this.totalMoney = this.buyNums*this.price*1.006
    },
});
$(function () {
    $("li.setp1").click(function () {
        if (!$(this).hasClass('active')) {
            var id = $(this).attr('item-id');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.classify.forEach(function (item, index) {
                if (item.id.toString() == id) {
                    vm.selectedShop = item.name;
                }
            });
        }
    });
    $("li.setp2").click(function () {
        if (!$(this).hasClass('active')) {
            var id = $(this).attr('item-id');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            vm.zjList.forEach(function (item, index) {
                if (item.id.toString() == id) {
                    vm.selectedZj = item.name;
                    vm.selectedZjPrice = item.money;
                }
            });
        }
    });
});