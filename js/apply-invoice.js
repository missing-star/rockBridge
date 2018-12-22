var vm = new Vue({
    el:'#app',
    data:{
        isApplied:false,
        invoiceInfo:{
            rise:'抬头名称',
            email:'123548965@qq.com'
        },
        isPerson:true
    },
    methods:{

    }
});

$(function() {
    $('div.switch-mask-click').click(function() {
        $(this).parent().toggleClass('active');
        $(this).siblings().toggleClass('active');
    });
    //tab切换
    $('li.tab-bar-item').click(function() {
        if(!$(this).hasClass('active')) {
            vm.isPerson = !vm.isPerson;
            var index = Array.prototype.slice.call(document.querySelectorAll('li.tab-bar-item')).indexOf(this);
            console.log(index);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('ul.repair-info').eq(index).addClass('active');
            $('ul.repair-info').eq(index).siblings().removeClass('active');
        }
    });
})