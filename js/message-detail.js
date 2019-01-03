var params = getParams();
var headerTitle = '';
switch (parseInt(params.type)) {
    case 0:
        headerTitle = '客服小秘';
        break;
    case 1:
        headerTitle = '商铺小助手';
        break;
    case 2:
        headerTitle = '订单通知';
        break;
}
var vm = new Vue({
    el: '#app',
    data: {
        headerTitle: headerTitle
    },
    methods: {

    }
});