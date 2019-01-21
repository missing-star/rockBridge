var vm = new Vue({
    el: '#app',
    data() {
        return {
            commentsInfo:''
        }
    },
    methods: {
        getDetail(type) {
            mui.openWindow({
                url: 'comments-category.html?type=' + type
            });
        }
    },
});

getComments();

function getComments() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsCollection`,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            vm.commentsInfo = data.result;
        },
        error: function () {
            mui.toast('服务器异常')
        }
    });
}