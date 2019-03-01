var vm = new Vue({
    el:'#app',
    data:{
        attractList:[]
    },
    methods:{
        goDetail(id) {
            mui.openWindow({
                url:'attract-investment-detail.html?id=' + id
            })
        }
    }
});

getAttractList();
function getAttractList() {
    $.ajax({
        url:`${rootUrl}/index/api/getLetsList`,
        dataType:'json',
        type:'post',
        success:function(data) {
            if(data.status == 1) {
                vm.attractList = data.result;
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