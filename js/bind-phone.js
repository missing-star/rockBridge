var vm = new Vue({
    el: '#app',
    data: {
        isInputAll: false,
        phone: '',
        phoneValidate: false,
        code: '',
        codeValidate: false,
        password: '',
        passwrodValidate: false,
        sendCode: false,
        waitTime: 60,
        msg: '获取验证码',
        originPhone:JSON.parse(localStorage.getItem('user')).users.phone
    },
    methods: {
        validatePhone() {
            this.phone = this.phone.slice(0, 11);
            if (parseInt(this.phone) && this.phone.length == 11) {
                this.phoneValidate = true;
                this.sendCode = true;
            } else {
                this.sendCode = false;
                this.phoneValidate = false;
            }
        },
        getCode() {
            // if(this.phone == this.originPhone) {
            //     mui.toast('请使用新手机号进行绑定');
            //     return;
            // }
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
        validateCode() {
            this.code = this.code.slice(0, 6);
            if (parseInt(this.code) && this.code.length == 6) {
                this.codeValidate = true;
            } else {
                this.codeValidate = false;
            }
        },
        validatePass() {
            this.password = this.password.replace(/\s/g, "");
            this.password = this.password.slice(0, 18);
            if (this.password.length >= 6) {
                this.passwrodValidate = true;
            } else {
                this.passwrodValidate = false;
            }
        },
        validateAll() {
            if (this.phoneValidate && this.codeValidate && this.passwrodValidate) {
                this.isInputAll = true;
            } else {
                this.isInputAll = false;
            }
        },
        clearPhone() {
            this.phone = '';
        },
        changeNow() {
            $.ajax({
                url:`${rootUrl}/index/api/updateUserPhone`,
                type:'post',
                dataType:'json',
                data:{
                    phone:this.originPhone,
                    password:this.password,
                    x_phone:this.phone,
                    code:this.code
                },
                success:function(data) {
                    mui.toast(data.msg);
                    if(data.status == 1) {
                        setTimeout(function(){
                            history.go(-1);
                        }, 200);
                    }
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        }
    },
    watch: {
        phone: function () {
            this.validateAll();
        },
        code: function () {
            this.validateAll();
        },
        password: function () {
            this.validateAll();
        }
    }
});