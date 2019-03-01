var vm = new Vue({
    el: '#app',
    data() {
        return {
            shopsInfo: ''
        }
    },
    methods: {
        //编辑
        editShops(id) {
            mui.openWindow({
                url: `bind-shops-add.html?id=${id}&type=edit`
            });
        }
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },

});

getSopsDetail();

function getSopsDetail() {
    $.ajax({
        url: `${rootUrl}/index/api/getAddressInfo`,
        data: {
            id: getParams().id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if(data.status == 1) {
                vm.shopsInfo = data.result;
            }
            else if(data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}