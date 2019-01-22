const vm = new Vue({
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
            vm.attractList = data.result;
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}