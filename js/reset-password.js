var vm = new Vue({
    el: '#app',
    data: {
        loginWay: 0,
        msg: '获取验证码',
        sendCode: true,
        phone: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).users.phone : '',
        waitTime: 60,
        password: '',
        code: '',
        rePassword: ''
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
        limitRePassword() {
            this.rePassword = limitLength(this.rePassword, 0, 18);
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
        submitRegister() {
            if (!validatePhone(this.phone)) {
                mui.toast('手机号不合法！');
                return false;
            } else if (this.code.length != 6 || isNaN(parseInt(this.code))) {
                mui.toast('请输入6位验证码！');
                return false;
            } else if (this.password.length < 6) {
                mui.toast('密码长度至少为6位！');
                return false;
            } else if (this.rePassword != this.password) {
                mui.toast('两次密码不一致！');
                return false;
            }
            $.ajax({
                url: `${rootUrl}/index/api/updateUserInfo`,
                type: 'post',
                dataType: 'json',
                data: {
                    phone: this.phone,
                    password: this.password,
                    code: this.code
                },
                success: function (data) {
                    if (data.status == 1) {
                        if (validateUser()) {
                            //已登录的用户需退出重新登录
                            $.ajax({
                                url: `${rootUrl}/index/api/getLoginOut`,
                                type: 'post',
                                dataType: 'json',
                                async: false,
                                success: function (data) {
                                    if (data.status == 1) {
                                        //重置本地存储信息
                                        localStorage.removeItem('user');
                                        localStorage.setItem('currentRole', 0);
                                    }
                                },
                                error: function () {
                                    mui.toast('服务器异常！');
                                }
                            });
                        }
                        mui.confirm('修改密码成功', '', ['确定'], function (e) {
                            setTimeout(function () {
                                mui.openWindow({
                                    url: 'user.html'
                                })
                            }, 500);
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