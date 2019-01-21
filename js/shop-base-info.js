new Vue({
    el: '#app',
    data: {

    },
    methods: {

    }
});

getShopInfo();

function getShopInfo() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsInfo`,
        data: {
            id: JSON.parse(localStorage.getItem('user')).shop_id
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {

        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}