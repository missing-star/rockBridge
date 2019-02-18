const vm = new Vue({
    el:'#app',
    data:{
        selectedNumber:''
    },
    methods: {
        goNext() {
            if(this.selectedNumber == '') {
                mui.toast('请选择门牌号!');
                return false;
            }
            mui.openWindow({
                url:`activation-validation.html?number=${this.selectedNumber}`
            });
        },
        getDetail(id) {
            mui.openWindow({
                url:`shops-info.html?id=${id}`
            });
        }
    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        const numberPicker = new $.PopPicker({title:'门牌号选择'});
        numberPicker.setData([
            {
                id:1,
                value:12355,
                text:'门牌号1'
            },
            {
                id:2,
                value:12355,
                text:'门牌号2'
            }
        ]);
        const eventBtn = doc.getElementById('number-btn');
        eventBtn.addEventListener('tap', function (event) {
            numberPicker.show(function (items) {
                vm.selectedNumber = items[0].text;
            });
        }, false);
    });
    getNotActivdShops();
})(mui, document);

/**
 * 获得未激活的商铺
 */

 function getNotActivdShops() {
    $.ajax({
        url:`${rootUrl}/index/api/getNotAddress`,
        type:'post',
        success:function(data) {

        },
        error:function() {
            mui.toast('服务器异常');
        }
    });
 }