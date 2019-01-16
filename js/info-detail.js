var vm = new Vue({
    el: '#app',
    data: {
        news: ''
    },
    methods: {

    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
            return `${rootUrl}${thumb}`;
        }
    }
});

$.ajax({
    url: `${rootUrl}/index/api/getArticleInfo`,
    type: 'post',
    data: {
        id: getParams().id
    },
    success: function (data) {
        if (data.status == 1) {
            vm.news = data.result;
        }
    },
    error: function () {
        mui.toast('服务器异常');
    }
});