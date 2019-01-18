var vm = new Vue({
    el: '#app',
    data() {
        return {

        }
    },
    methods: {

    },
});

$(function () {
    $("li.comment-category-item").click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    });
});