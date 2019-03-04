var vm = new Vue({
    el: '#app',
    data: {
        selectedNumber: '',
        selectedId:'',
        shopsList:[]
    },
    methods: {
        goNext() {
            if (this.selectedNumber == '') {
                mui.toast('请选择门牌号!');
                return false;
            }
            mui.openWindow({
                url: `activation-validation.html?number=${this.selectedNumber}`
            });
        },
        getDetail(id) {
            mui.openWindow({
                url: `shops-info.html?id=${id}`
            });
        }
    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        var numberPicker = new $.PopPicker({
            title: '门牌号选择'
        });
        var data = getNotActivedAddress().map(function(address,index) {
            return {
                value:address.id,
                text:address.province + address.city + address.address 
            }
        });
        numberPicker.setData(data);
        var eventBtn = doc.getElementById('number-btn');
        eventBtn.addEventListener('tap', function (event) {
            numberPicker.show(function (items) {
                vm.selectedId = items[0].value;
                vm.selectedNumber = items[0].text;
                getNotActivdShops(vm.selectedId);
            });
        }, false);
    });
})(mui, document);

/**
 * 获得未激活的地址列表
 */
function getNotActivedAddress() {
    var result = '';
    $.ajax({
        url: `${rootUrl}/index/api/getNotAddress`,
        type: 'post',
        dataType:'json',
        async:false,
        success: function (data) {
            if(data.status == 1) {
                result = data.result;
            }
            else if(data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
    return result;
}

/**
 * 根据地址获得未激活的店铺
 */

function getNotActivdShops(address_id) {
    $.ajax({
        url: `${rootUrl}/index/api/getShopRelatedAddress`,
        type: 'post',
        dataType:'json',
        data: {
            address_id: address_id
        },
        success: function (data) {
            if(data.status == 1) {
                vm.shopsList = data.result;
                sessionStorage.setItem('activeName',data.result[0].person_name);
                sessionStorage.setItem('activePhone',data.result[0].phone);
            }else if(data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}