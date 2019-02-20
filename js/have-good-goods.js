const vm = new Vue({
    el:'#app',
    data:{
        adList:[]
    },
    methods:{
        goLink(url) {
            mui.openWindow({
                url:url
            })
        }
    },
    filters:{
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
});

getAdList();
function getAdList() {
    $.ajax({
        url:`${rootUrl}/index/api/getPopularityGoods`,
        dataType:'json',
        type:'post',
        data:{
            type:2
        },
        success:function(data) {
            if(data.status == 1) {
                vm.adList = data.result;
            }
        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
}