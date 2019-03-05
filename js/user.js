var userData = '';
getUserInfo();
var vm = new Vue({
    el: '#app',
    data: {
        currentRole: sessionStorage.getItem('currentRole') || 0,
        userData: userData,
        isSwitchRole: sessionStorage.getItem('switchRole'),
        showMsg:'',
        isForce:true
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
                    if (vm.isForce && flag) {
                        mui.toast(vm.showMsg);
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

/**
 * 获得申请商户的信息
 */
function getApplyInfo() {
    $.ajax({
        url:`${rootUrl}/index/api/getAddShopInfo`,
        dataType:'json',
        type:'post',
        async:false,
        success:function(data) {
            if(data.status == -1) {
                vm.showMsg = data.msg;
            }
            else {
                vm.isForce = false;
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}
getApplyInfo();