var vm = new Vue({
    el:'#app',
    data:{
        isEditName:false,
        inputName:'叠石桥家纺城',
        editName:''
    },
    methods:{
        limitName() {
            this.editName = this.editName.replace(/\s+/g, "");
            this.editName = this.editName.slice(0,8);
        },
        clearInput() {
            this.editName = '';
        },
        editShopName() {
            this.isEditName = true;
        },
        confirmName() {
            if(this.editName.length != 0) {
                this.inputName = this.editName;
                this.isEditName = false;
            }
            else {
                mui.toast('请输入名称!');
            }
        },
        applyCancel() {
            mui.openWindow({
                url:'shop-cancellation.html'
            })
        },
        hideInput() {
            this.isEditName = false;
        }
    }
})