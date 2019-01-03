var vm = new Vue({
    el: '#app',
    data: {
        loginWay: 0,
        msg: '获取验证码',
        sendCode: false,
        phone: '',
        waitTime: 60,
        password: '',
        code: ''
    },
    methods: {
        changeWay(way) {
            this.loginWay = way;
        },
        validatePhone() {
            this.phone = this.phone.slice(0, 11);
            if (parseInt(this.phone) && this.phone.length == 11) {
                this.sendCode = true;
            } else {
                this.sendCode = false;
            }
        },
        getCode() {
            if (this.sendCode && this.waitTime == 60) {
                this.msg = this.waitTime + 's';
                var interval = setInterval(function () {
                    if (vm.waitTime == 1) {
                        vm.msg = '获取验证码';
                        clearInterval(interval);
                        return false;
                    }
                    vm.waitTime -= 1;
                    vm.msg = vm.waitTime + 's';
                }, 1000);
            } else if (!this.sendCode) {
                mui.toast('手机号不合法!');
            }
        },
        clearPhone() {
            this.phone = '';
        },
        validateCode() {
            this.code = this.code.slice(0, 6);
        },
        resetPass() {
            mui.openWindow({
                url: 'reset-password.html'
            })
        },
        submitLogin() {
            var formData = {
                phone: this.phone,
                password: this.password,
                code: this.code
            }
            if (!parseInt(formData.phone) || formData.phone.length != 11) {
                mui.toast('请输入正确的手机号！');
                return false;
            } else if (formData.password.length < 6 && vm.loginWay == 0) {
                mui.toast('密码至少为6位');
                return false;
            } else if ((formData.code.length != 6 || !parseInt(formData.code)) && vm.loginWay == 1) {
                mui.toast('请输入6位验证码');
                return false;
            }
            if (this.loginWay == 0) {
                formData.code = '';
            } else {
                formData.password = '';
            }
            $.ajax({
                url: `${rootUrl}/index/api/getLogin`,
                type: 'post',
                dataType: 'json',
                data: formData,
                async: false,
                success: function (data) {
                    mui.toast(data.msg);
                    if (data.status == 1) {
                        //设置维修员和其他人员跳转
                        if (data.result.re_id > 0) {
                            mui.openWindow({
                                url: 'repairman.html'
                            });
                        } else {
                            mui.openWindow({
                                url: 'user.html'
                            });
                        }
                        //设置会员和商户的切换权限
                        if (data.result.shop_id > 0) {
                            localStorage.setItem('switchRole', 1);
                        } else {
                            localStorage.setItem('switchRole', 0);
                        }
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            })
        }
    }
});
