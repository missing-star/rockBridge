var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        exitLogin() {
            //退出登录
            mui.confirm('确认退出登录吗？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getLoginOut`,
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            if (data.status == 1) {
                                mui.toast('退出成功!');
                                //重置本地存储信息
                                localStorage.removeItem('user');
                                localStorage.setItem('currentRole', 0);
                                setTimeout(function () {
                                    mui.openWindow({
                                        url: 'user.html'
                                    });
                                }, 500);
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常！');
                        }
                    });
                }
            });
        }
    }
});