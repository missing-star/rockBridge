var vm = new Vue({
    el: '#app',
    data: {
        selectedNumber: '',
        selectedId: '',
        shopsList: []
    },
    methods: {
        goNext() {
            if (this.selectedNumber == '' || !this.selectedNumber) {
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
        var numberPicker = new mui.PopPicker({
            layer: 3,
            title: '门牌号选择'
        });
        var data = getNotActivedAddress().map(function (province, i) {
            return {
                value: province.id,
                text: province.cate_name,
                children: province.children.map(function (city, j) {
                    return {
                        value: city.id,
                        text: city.cate_name,
                        children: city.children.map(function (district, k) {
                            return {
                                value: district.id,
                                text: district.address
                            }
                        })
                    }
                })
            }
        });
        numberPicker.setData(data);
        var eventBtn = doc.getElementById('number-btn');
        eventBtn.addEventListener('tap', function (event) {
            numberPicker.show(function (items) {
                if (!items[2].value) {
                    mui.toast('无效地址!');
                    return false;
                }
                vm.selectedId = items[2].value;
                vm.selectedNumber = items[0].text + items[1].text + items[2].text;
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
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.status == 1) {
                result = data.result;
            } else if (data.status == 202) {
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
        dataType: 'json',
        data: {
            address_id: address_id
        },
        success: function (data) {
            if (data.status == 1) {
                vm.shopsList = data.result;
                sessionStorage.setItem('activeName', data.result[0].person_name);
                sessionStorage.setItem('activePhone', data.result[0].phone);
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}