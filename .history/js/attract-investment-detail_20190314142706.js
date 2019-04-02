var vm = new Vue({
    el:'#app',
    data:{
        name:'',
        phone:'',
        attractInfo:''
    },
    methods:{
        reverseAttract() {
            //预约
            mui('#sheet1').popover('toggle');
        },
        limitName() {
            this.name = this.name.substring(0,6);
        },
        limitPhone() {
            this.phone = this.phone.substring(0,11);
        },
        submitReverse() {
            //预约招商招租
            var regPhone = /^1\d{9}\d$/;
            if(this.name == '') {
                mui.toast('请输入姓名');
                return;
            }
            else if(!regPhone.test(this.phone)) {
                mui.toast('手机号不合法');
                return;
            }
            //发送请求
            $.ajax({
                url:`${rootUrl}/index/api/getAddAppointment`,
                data:{
                    phone:this.phone,
                    username:this.name
                },
                type:'post',
                dataType:'json',
                success:function(data) {
                    mui.toast(data.msg);
                    if(data.status == 1) {
                        vm.name = '';
                        vm.phone = '';
                        mui('#sheet1').popover('toggle');
                    }else if(data.status == 202) {
                        goLogin();
                    }
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            })
        }
    }
});

getAttractDetail();

function getAttractDetail(id) {
    $.ajax({
        url:`${rootUrl}/index/api/getLetsInfo`,
        data:{
            id:getParams().id
        },
        type:'post',
        dataType:'json',
        success:function(data) {
            if(data.status == 1) {
                vm.attractInfo = data.result;
            }else if(data.status == 202) {
                goLogin();
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}

document.querySelector('a.confirm').addEventListener('tap',function() {
    vm.submitReverse();
});