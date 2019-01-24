const vm = new Vue({
    el: '#app',
    data() {
        return {

        }
    },
    methods: {
        goBind() {
            mui.openWindow({
                url:'bind-shops-add.html'
            });
        },
        //详情
        getDetail(id) {
            mui.openWindow({
                url:`shops-shops-detail.html?id=${id}`
            });
        },
        //编辑
        editShops(id) {
            mui.openWindow({
                url:`bind-shops-add.html?id=${id}`
            });
        }
    }
});
$(function () {
    $('li.goods-tab-bar-item').click(function () {
        //切换tab页
        if (!$(this).hasClass('active')) {
            var index = Array.prototype.slice.call(document.querySelectorAll('li.goods-tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.goods-tab-content-item').eq(index).addClass('active');
            $('div.goods-tab-content-item').eq(index).siblings().removeClass('active');
        }
    });
});