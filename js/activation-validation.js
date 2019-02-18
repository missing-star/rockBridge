const vm = new Vue({
    el: '#app',
    data() {
        return {
            btnInfo: '发送验证码',
            time: 60,
            code: '',
            username: localStorage.getItem('activeName'),
            phone: localStorage.getItem('activePhone')
        }
    },
    methods: {
        sendCode() {
            if (this.time == 60) {
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
                            vm.btnInfo = `${vm.time}s`;
                            const interval = setInterval(function () {
                                if (vm.time == 1) {
                                    clearInterval(interval);
                                    vm.time = 60;
                                    vm.btnInfo = '发送验证码';
                                    return;
                                }
                                vm.time -= 1;
                                vm.btnInfo = `${vm.time}s`;
                            }, 1000);
                        }
                    },
                    error: function () {
                        mui.toast('服务器异常');
                    }
                });
            }
        },
        limitCodeLength() {
            this.code = this.code.substring(0, 6);
        },
        activeNow() {
            if (this.code.length != 6) {
                mui.toast('请输入6位数字验证码');
                return;
            }
            //验证。。。
            $.ajax({
                url: `${rootUrl}/index/api/getShopActivate`,
                type: 'post',
                data: {

                },
                dataType: 'json',
                success: function (data) {
                    if (data.status == 1) {
                    mui('#sheet1').popover('toggle');
                    }
                    else {
                        mui.toast('激活失败');
                    }
                },
                error: function () {
                    mui.toast('服务器异常');
                }
            });
        }
    }
});