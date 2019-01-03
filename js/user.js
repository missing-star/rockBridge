
getUserInfo();

/**
 * 获取用户信息
 */
function getUserInfo(temp) {
    $.ajax({
        url: `${rootUrl}/index/api/getMyCenter`,
        type: 'post',
        async: false,
        datType: 'json',
        success: function (data) {
            localStorage.setItem('user', JSON.stringify(data.result));
            if(data.result.shop_id > 0) {
                localStorage.setItem('switchRole',1);
            }
            else {
                localStorage.setItem('switchRole',0);
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}

new Vue({
    el: '#app',
    data: {
        currentRole: localStorage.getItem('currentRole'),
        userData: JSON.parse(localStorage.getItem('user')),
        isSwitchRole: localStorage.getItem('switchRole')
    },
    methods: {
        //切换用户角色
        switchRole() {
            if (this.isSwitchRole == 0) {
                mui.toast('请先进行商户认证！');
                return false;
            }
            if (this.currentRole == 0) {
                localStorage.setItem('currentRole', 1);
            } else {
                localStorage.setItem('currentRole', 0);
            }
            this.currentRole = localStorage.getItem('currentRole');
        },
        //登录
        login() {
            if (this.userData) {
                //个人信息
                mui.openWindow({
                    url: 'personal-info.html'
                })
            } else {
                //去登录
                mui.openWindow({
                    url: 'login.html'
                })
            }
        }
    },
    created() {}
});




mui('body').on('tap', 'a', function () {
    this.click();
});
/**
 * 项目入口（钱包，收藏等）
 */
function enterItem(url) {
    if (validateUser()) {
        mui.openWindow({
            url: url
        });
    } else {
        mui.toast('请登录后操作！');
    }
}
