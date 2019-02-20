const vm = new Vue({
    el:'#app',
    data:{
        goodsList:[]
    },
    methods:{   
        goDetail(url,id) {
            mui.openWindow({
                url:`${url}?id=${id}`
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