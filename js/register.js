var vm = new Vue({
    el: '#app',
    data: {
        loginWay: 0,
        msg: '获取验证码',
        sendCode: false,
        phone: '',
        waitTime: 60,
        password: '',
        code: '',
        isShowPwd:false
    },
    methods: {
        showHidePwd() {
            this.isShowPwd = !this.isShowPwd;
        },
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
                $.ajax({
                    url: `${rootUrl}/index/api/sendSms`,
                    data: {
                        phone: this.phone
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        mui.toast(data.msg);
                        if (data.status == 1) {
                            this.msg = this.waitTime + 's';
                            var interval = setInterval(function () {
                                if (vm.waitTime == 1) {
                                    vm.waitTime = 60;
                                    vm.msg = '获取验证码';
                                    clearInterval(interval);
                                    return false;
                                }
                                vm.waitTime -= 1;
                                vm.msg = vm.waitTime + 's';
                            }, 1000);
                        }
                    },
                    error: function () {
                        mui.toast('服务器异常');
                    }
                });

            } else if (!this.sendCode) {
                mui.toast('手机号不合法!');
            }
        },
        limitPassword() {
            this.password = limitLength(this.password, 0, 18);
        },
        clearPhone() {
            this.phone = '';
        },
        validateCode() {
            this.code = this.code.slice(0, 6);
            if (parseInt(this.code) && this.code.length == 6) {
                this.codeValidate = true;
            } else {
                this.codeValidate = false;
            }
        },
        readProtocol() {
            //查看协议
            mui.openWindow({
                url:'protocol.html'
            });
        },
        submitRegister() {
            if (!validatePhone(this.phone)) {
                mui.toast('手机号不合法！');
                return false;
            } else if (this.password.length < 6) {
                mui.toast('密码长度至少为6位！');
                return false;
            }
            $.ajax({
                url: `${rootUrl}/index/api/getRegister`,
                type: 'post',
                dataType: 'json',
                data: {
                    phone: this.phone,
                    password: this.password,
                    code: this.code
                },
                success: function (data) {
                    if (data.status == 1) {
                        mui.confirm('注册成功', '', ['确定'], function (e) {
                            mui.openWindow({
                                url: 'login.html'
                            });
                        });
                    } else {
                        mui.toast(data.msg);
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            })
        }
    }
});