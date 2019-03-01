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
            if(data.status == 1) {
                vm.commentsInfo = data.result;
            }else if(data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常')
        }
    });
}