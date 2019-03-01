var userData = '';
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
            if (data.status == 1) {
                sessionStorage.setItem('user', JSON.stringify(data.result));
                userData = data.result;
                if (data.result.shop_id > 0) {
                    sessionStorage.setItem('switchRole', 1);
                } else {
                    sessionStorage.setItem('switchRole', 0);
                }
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}

var vm = new Vue({
    el: '#app',
    data: {
        currentRole: sessionStorage.getItem('currentRole') || 0,
        userData: userData,
        isSwitchRole: sessionStorage.getItem('switchRole')
    },
    methods: {
        //切换用户角色
        switchRole() {
            if (this.isSwitchRole == 0) {
                mui.toast('请先进行商户认证！');
                mui.openWindow({
                    url: 'shop-auth.html'
                });
                return false;
            }
            if (this.currentRole == 0) {
                sessionStorage.setItem('currentRole', 1);
            } else {
                sessionStorage.setItem('currentRole', 0);
            }
            this.currentRole = sessionStorage.getItem('currentRole');
        },
        //登录
        login() {
            if (this.userData) {
                if (this.currentRole == 0) {
                    //个人信息
                    mui.openWindow({
                        url: 'personal-info.html'
                    });
                }
            } else {
                //去登录
                mui.openWindow({
                    url: 'login.html'
                })
            }
        },
        /**
         * 项目入口（钱包，收藏等）
         */
        enterItem(url, flag) {
            if (validateUser()) {
                if (validateUserPhone()) {
                    if (flag) {
                        mui.toast('您已进行过商户认证');
                        return false;
                    }
                    //已绑定手机号
                    mui.openWindow({
                        url: url
                    });
                } else {
                    //未绑定手机号
                    mui.openWindow({
                        url: 'bind-phone.html'
                    });
                }
            } else {
                mui.toast('请登录后操作！');
            }
        }
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    created() {}
});




mui('body').on('tap', 'a', function () {
    this.click();
});