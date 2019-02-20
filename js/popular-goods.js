const vm = new Vue({
    el:'#app',
    data:{
        goodsList:[]
    },
    methods:{
        
    }
});

getGoodsList();
function getGoodsList() {
    $.ajax({
        url:`${rootUrl}/index/api/getPopularityGoods`,
        dataType:'json',
        type:'post',
        data:{
            type:1
        },
        success:function(data) {
            if(data.status == 1) {
                vm.goodsList = data.result;
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}