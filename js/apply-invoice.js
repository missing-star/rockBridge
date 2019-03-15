var param = getParams();
var vm = new Vue({
    el: '#app',
    data: {
        isApplied: false,
        invoiceInfo: {
            //抬头
            rise: '',
            //邮箱
            email: '',
            //税号
            number: '',
            //开户行
            bankName: '',
            //开户账号
            bankNum: '',
            //企业地址
            erpAdd: '',
            //企业电话
            erpTel: '',
            //是否常用
            isOftern: 0
        },
        isPerson: true
    },
    methods: {
        validateName() {
            this.invoiceInfo.rise = this.invoiceInfo.rise.replace(/\s+/g, "");
        },
        submitApply() {
            var formData = {
                invoice_title: this.invoiceInfo.rise,
                invoice_email: this.invoiceInfo.email,
                invoice_type: this.isPerson ? 0 : 1
            }
            if (!this.isPerson) {
                var other = {
                    invoice_duty: vm.invoiceInfo.number,
                    invoice_bank: vm.invoiceInfo.bankName,
                    invoice_code: vm.invoiceInfo.bankNum,
                    invoice_address: vm.invoiceInfo.erpAdd,
                    invoice_phone: vm.invoiceInfo.erpTel
                }
                for (key in other) {
                    formData[key] = other[key];
                }
            }
            //验证
            var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            if (formData.invoice_title == '') {
                mui.toast('请输入发票抬头');
                return false;
            } else if (formData.invoice_type == 1 && formData.invoice_duty == '') {
                mui.toast('请输入税号');
                return false;
            } else if (!emailReg.test(formData.invoice_email)) {
                mui.toast('邮箱格式不正确！');
                return false;
            }
            $.ajax({
                url: `${rootUrl}/index/api/getUpdatePayInvoice`,
                type: 'post',
                data: formData,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 1) {
                        mui.confirm('保存成功', '', ['确定'], function (e) {
                            history.go(-1);
                        });
                    } else if (data.status == 202) {
                        goLogin();
                    } else {
                        mui.toast(data.msg);
                    }
                },
                error: function () {
                    mui.toast('服务器异常！');
                }
            });
        }
    }
});

$(function () {
    $('div.switch-mask-click.enable').click(function () {
        $(this).parent().toggleClass('active');
        $(this).siblings().toggleClass('active');
        console.log($(this).parent().hasClass('active'));
        if ($(this).parent().hasClass('active')) {
            vm.invoiceInfo.isOftern = 1;
        } else {
            vm.invoiceInfo.isOftern = 0;
        }
    });
    //tab切换
    $('li.tab-bar-item').click(function () {
        if (!$(this).hasClass('active')) {
            vm.isPerson = !vm.isPerson;
            var index = Array.prototype.slice.call(document.querySelectorAll('li.tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('ul.repair-info').eq(index).addClass('active');
            $('ul.repair-info').eq(index).siblings().removeClass('active');
            getInvoiceInfo(index);
        }
    });
})

/**
 * 获得发票信息
 */

function getInvoiceInfo(type) {
    $.ajax({
        url: `${rootUrl}/index/api/getInvoiceInfo`,
        dataType: 'json',
        type:'post',
        data:{
            invoice_type:type
        },
        success: function (data) {
            if (data.status == 1) {
                resetData();
                vm.invoiceInfo.rise = data.result.invoice_title;
                vm.invoiceInfo.email = data.result.invoice_email;
                if(type == 1) {
                    //企业
                    vm.invoiceInfo.number = data.result.invoice_duty;
                    vm.invoiceInfo.bankName = data.result.invoice_bank;
                    vm.invoiceInfo.bankNum = data.result.invoice_code;
                    vm.invoiceInfo.erpAdd = data.result.invoice_address;
                    vm.invoiceInfo.erpTel = data.result.invoice_phone;
                }
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}

getInvoiceInfo(0);

function resetData() {
    vm.invoiceInfo = {
        //抬头
        rise: '',
        //邮箱
        email: '',
        //税号
        number: '',
        //开户行
        bankName: '',
        //开户账号
        bankNum: '',
        //企业地址
        erpAdd: '',
        //企业电话
        erpTel: ''
    }
}