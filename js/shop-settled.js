var vm = new Vue({
    el: '#app',
    data: {
        currentStep: 1,
        totalMoney: 3500,
        selectedZj: '顶级展架',
        selectedZjPrice:500,
        selectedShop:'品牌店铺',
        classify: [{
            id: 0,
            name: '品牌店铺'
        }, {
            id: 1,
            name: '专营店铺'
        }, {
            id: 2,
            name: '企业店铺'
        }, {
            id: 3,
            name: '试营店铺'
        }],
        zjList: [{
            id: 0,
            name: '顶级展架',
            amount: 80,
            money: 500
        }, {
            id: 1,
            name: '高级展架',
            amount: 50,
            money: 400
        }, {
            id: 2,
            name: '中级展架',
            amount: 30,
            money: 300
        }, {
            id: 3,
            name: '初级展架',
            amount: 10,
            money: 0
        }]
    },
    methods: {
        goSecond() {
            this.currentStep = 2;
        },
        getThird() {
            this.currentStep = 3;
        },
        backToTwo() {
            this.currentStep = 2;
        },
        backToOne() {
            this.currentStep = 1;
        },
        submitAndPay() {

        }
    }
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