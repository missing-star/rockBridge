var vm = new Vue({
    el: '#app',
    data() {
        return {
            btnInfo: '发送验证码',
            time: 60,
            code: '',
            username: sessionStorage.getItem('activeName'),
            phone: sessionStorage.getItem('activePhone'),
            password: '',
            mainCategoryId: '',
            subMainCategoryId: '',
            mainCategoryName: ''
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
                            var interval = setInterval(function () {
                                if (vm.time == 1) {
                                    clearInterval(interval);
                                    vm.time = 60;
                                    vm.btnInfo = '发送验证码';
                                    return;
                                }
                                vm.time -= 1;
                                vm.btnInfo = `${vm.time}s`;
                            }, 1000);
                        } else if (data.status == 202) {
                            goLogin();
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
            if(this.mainCategoryName == '' || !this.mainCategoryName) {
                mui.toast('请选择经营类目!');
                return;
            }
            if (this.password.trim() == '') {
                mui.toast('请输入密码!');
                return;
            } else if (this.code.length != 6) {
                mui.toast('请输入6位数字验证码');
                return;
            }
            //验证。。。
            $.ajax({
                url: `${rootUrl}/index/api/getShopActivate`,
                type: 'post',
                data: {
                    phone: vm.phone,
                    password: vm.password,
                    code: vm.code,
                    one_cate_id:vm.mainCategoryId,
                    two_cate_id:vm.subMainCategoryId
                },
                dataType: 'json',
                success: function (data) {
                    if (data.status == 1) {
                        mui('#sheet1').popover('toggle');
                    } else if (data.status == 202) {
                        goLogin();
                    } else {
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

$(function () {
    document.getElementById('confirm').addEventListener('tap', function () {
        mui.openWindow({
            url: `login.html`
        });
    });
});

(function ($, doc) {
    $.init();
    $.ready(function () {
        jQuery.ajax({
            url: 'http://dieshiqiao.pzhkj.cn/index/api/getShopsGoodsCateList',
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                if (data.status == 1) {
                    var categoryPicker = new $.PopPicker({
                        layer: 2
                    });
                    data.result = data.result.map(function (item, index) {
                        return {
                            id: item.id,
                            text: item.cate_name,
                            children: item.children.map(function (child, j) {
                                return {
                                    id: child.id,
                                    text: child.cate_name
                                }
                            })
                        }
                    });
                    categoryPicker.setData(data.result);
                    var cateClickBtn = doc.getElementById('main-category');
                    cateClickBtn.addEventListener('tap', function (event) {
                        categoryPicker.show(function (items) {
                            vm.mainCategoryId = items[0].id;
                            if(items[1].id) {
                                vm.mainCategoryName = items[0].text + ' ' + items[1].text;
                                vm.subMainCategoryId = items[1].id;
                            }
                            else {
                                vm.mainCategoryName = items[0].text;
                                vm.subMainCategoryId = '';
                            }
                        });
                    }, false);
                } else if (data.status == 202) {
                    goLogin();
                }
            },
            error: function () {
                mui.toast('获取类目异常!');
            }
        });
    });
})(mui, document);