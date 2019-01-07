new Vue({
    el:'#app',
    data:{
        inputMoney:'',
        balance:parseFloat(225.00).toFixed(2),
        //金额验证是否通过
        isValid:false,
        //正则
        reg:/(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        //警告
        warning:''
    },
    methods:{
        //全部提现
        getAllMoney() {
            this.inputMoney = this.balance;
        }
    },
    watch:{
        inputMoney:function(newValue,oldValue) {
            console.log('validate');
            //验证输入的金额
            if(this.reg.test(this.inputMoney)) {
                this.isValid = true;
                if(this.inputMoney > this.balance) {
                    this.warning = '余额不足';
                }
            }
            else {
                this.warning = '金额有误';
                this.isValid = false;
            }
        }
    }
})