var page = 1;
var vm = new Vue({
    el: '#app',
    data: {
        name:'aaa',
        type: getParams().type,
        commentsList: [],
        nums: {
            good: 0,
            img: 0,
            medium: 0,
            negative: 0,
            total: 0
        }
    },
    filters:{
        filterImg(thumb) {
            thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        showTab(type) {
            if (this.type != type) {
                this.type = type;
                vm.commentsList = [];
                getCommentsByType(type);
            }
        }
    }
});

$(function () {
    getCommentsByType(getParams().type);
    //滚动加载
    $(window).scroll(function () {
        if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (vm.isMore) {
                page += 1;
                getCommentsByType(vm.type);
            }
        }
    });
});


function getCommentsByType(type) {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsCollectionList`,
        async: false,
        data: {
            type: type,
            page: page
        },
        dataType: 'json',
        type: 'post',
        success: function (data) {
            vm.commentsList = vm.commentsList.concat(data.result.review_list);
            vm.nums.good = data.result.good;
            vm.nums.img = data.result.img_count;
            vm.nums.total = data.result.total_count;
            vm.nums.negative = data.result.negative;
            vm.nums.medium = data.result.medium;
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}