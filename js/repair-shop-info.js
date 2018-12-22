var vm = new Vue({
    el:'#app',
    data:{
        phone:''
    },
    methods:{
        limitPhone() {
            this.phone = this.phone.substring(0,11);
        }
    }
});