var vm = new Vue({
    el:'#app',
    data() {
        return {
            shop_code:'',
            shop_name:'',
            person_name:'',
            phone:'',
            shop_address:''
        }
    },
    methods: {
        
    }
});
getShopsInfo(getParams().id);
/**
 * 获得商铺信息
 */
function getShopsInfo(shops_id) {
    $.ajax({
        url:`/index/api/getShopAddressInfo`,
        dataType:'json',
        data:{
            address_id:shops_id
        },
        type:'post',
        success:function(data) {
            if(data.status == 1) {
                vm.shop_code = data.result.shop_code;
                vm.shop_name = data.result.title;
                vm.person_name = data.result.person_name;
                vm.phone = data.result.phone;
                vm.shop_address = data.result.province + data.result.city + data.result.area + data.result.stage + data.result.building + data.result.address;
            }
            else if(data.status == 202) {
                goLogin();
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}