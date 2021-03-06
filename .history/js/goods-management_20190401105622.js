var vm = new Vue({
    el: '#app',
    data: {
        upperList: [],
        upperListTotal: 0,
        stockList: [],
        stockListTotal: 0,
        lowerList: [],
        lowerListTotal: 0,
        comments: [1, 2, 4, 5, 5],
        upperSelectedCount: 0,
        stockSelectedCount: 0,
        allUpperId: [],
        allLowerId: [],
        isShowLegal: false,
        protocolContent: ''
    },
    filters: {
        //拼接图片地址
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if (thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    },
    methods: {
        //设为下架
        setDown(id) {
            mui.confirm('确认将该商品设为下架？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getShopsGoodsStand`,
                        data: {
                            id: id,
                            type: 2
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            } else if (data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });

        },
        //批量下架
        setDownAll() {
            if (this.allLowerId.length == 0) {
                mui.toast('请选中商品!');
                return false;
            }
            mui.confirm('确认将这些商品设为下架？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getShopsGoodsStand`,
                        data: {
                            id: vm.allLowerId.join(','),
                            type: 2
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            } else if (data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        //设为上架
        setUpper(id) {
            mui.confirm('确认将该商品设为上架？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getShopsGoodsStand`,
                        data: {
                            id: id,
                            type: 1
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            } else if (data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        //批量上架
        setUpperAll() {
            if (this.allUpperId.length == 0) {
                mui.toast('请选中商品!');
                return false;
            }
            mui.confirm('确认将这些商品设为上架？', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getShopsGoodsStand`,
                        data: {
                            id: vm.allUpperId.join(','),
                            type: 1
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            } else if (data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        selctAllUpper() {
            //选中所有上架商品
            var elem = $('div.tools-bar.upper').find('span.checkbox');
            elem.toggleClass('active');
            if (elem.hasClass('active')) {
                //选中所有商品
                $('.goods-item.upper').find('span.checkbox').addClass('active');
                for (var i = 0; i < this.upperList.length; i++) {
                    this.allLowerId.push(this.upperList[i].id);
                }
                this.upperSelectedCount = this.upperList.length;
            } else {
                //取消全选
                $('.goods-item.upper').find('span.checkbox').removeClass('active');
                this.allLowerId = [];
                this.upperSelectedCount = 0;
            }
        },
        selctAllStock() {
            //（选中/取消全选）所有下架商品
            var elem = $('div.tools-bar.stock').find('span.checkbox');
            elem.toggleClass('active');
            if (elem.hasClass('active')) {
                //选中所有商品
                $('.goods-item.stock').find('span.checkbox').addClass('active');
                for (var i = 0; i < this.lowerList.length; i++) {
                    this.allUpperId.push(this.lowerList[i].id);
                }
                this.stockSelectedCount = this.lowerList.length;
            } else {
                //取消全选
                $('.goods-item.stock').find('span.checkbox').removeClass('active');
                this.allUpperId = [];
                this.stockSelectedCount = 0;
            }
        },
        uplodGoods() {
            if (JSON.parse(sessionStorage.getItem('user')).shops.is_pro != 1) {
                this.isShowLegal = true;
                getUserProtocol();
            } else {
                mui.openWindow({
                    url: 'upload-goods.html?type=add'
                });
            }
        },
        refuseProtocol() {
            this.isShowLegal = false;
        },
        acceptProtocol() {
            this.isShowLegal = false;
            userAcceptProtocol();
        },
        //获得商品详情
        getGoodsDetail(id) {
            mui.openWindow({
                url: 'goods-detail.html?id=' + id
            });
        },
        //删除商品
        deleteGoods(id) {
            mui.confirm('确认删除改商品吗', '', ['取消', '确定'], function (e) {
                if (e.index == 1) {
                    $.ajax({
                        url: `${rootUrl}/index/api/getShopsGoodsEdit`,
                        data: {
                            act: 'del',
                            id: id
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            mui.toast(data.msg);
                            if (data.status == 1) {
                                setTimeout(function () {
                                    location.reload();
                                }, 200);
                            } else if (data.status == 202) {
                                goLogin();
                            }
                        },
                        error: function () {
                            mui.toast('服务器异常');
                        }
                    });
                }
            });
        },
        //编辑商品
        editGoods(id) {
            mui.openWindow({
                url: 'upload-goods.html?type=edit&id=' + id
            });
        },
        operateUpper(e) {
            //上架的商品选中操作
            $(e.target).parent().find('span.checkbox').toggleClass('active');
            if ($(e.target).parent().find('span.checkbox').hasClass('active')) {
                //选中上架商品的数量+1
                this.upperSelectedCount += 1;
                this.allLowerId.push($(e.target).parent().attr('goods-id'));
                if (this.upperSelectedCount == this.upperList.length) {
                    $('div.tools-bar.upper').find('span.checkbox').addClass('active');
                }
            } else {
                //选中上架商品的数量-1
                this.upperSelectedCount -= 1;
                this.allLowerId.splice(this.allLowerId.indexOf($(e.target).parent().attr('goods-id')), 1);
                $('div.tools-bar.upper').find('span.checkbox').removeClass('active');
            }
        },
        operateStock(e) {
            //下架的商品选中操作
            $(e.target).parent().find('span.checkbox').toggleClass('active');
            if ($(e.target).parent().find('span.checkbox').hasClass('active')) {
                //选中上架商品的数量+1
                this.stockSelectedCount += 1;
                this.allUpperId.push($(e.target).parent().attr('goods-id'));
                if (this.stockSelectedCount == this.lowerList.length) {
                    $('div.tools-bar.stock').find('span.checkbox').addClass('active');
                }
            } else {
                //选中上架商品的数量-1
                this.stockSelectedCount -= 1;
                this.allUpperId.splice(this.allUpperId.indexOf($(e.target).parent().attr('goods-id')), 1);
                $('div.tools-bar.stock').find('span.checkbox').removeClass('active');
            }
        }
    }
});
$(function () {
    getGoodsList(1, 'upperList');
    $('li.goods-tab-bar-item').click(function () {
        var status = $(this).attr('data-type');
        //切换tab页
        if (!$(this).hasClass('active')) {
            switch (status) {
                case '1':
                    if (vm.upperList.length == 0) {
                        getGoodsList(status, 'upperList');
                    }
                    break;
                case '4':
                    if (vm.lowerList.length == 0) {
                        getGoodsList(status, 'lowerList');
                    }
                    break;
                case '2,3':
                    if (vm.stockList.length == 0) {
                        getGoodsList(status, 'stockList');
                    }
                    break;
            }
            var index = Array.prototype.slice.call(document.querySelectorAll('li.goods-tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.goods-tab-content-item').eq(index).addClass('active');
            $('div.goods-tab-content-item').eq(index).siblings().removeClass('active');
        }
    });
    vm.$nextTick(function () {
        //上架的商品选中操作
        $('.goods-info.upper').click(function () {
            $(this).find('span.checkbox').toggleClass('active');
            if ($(this).find('span.checkbox').hasClass('active')) {
                //选中上架商品的数量+1
                vm.upperSelectedCount += 1;
                vm.allLowerId.push($(this).attr('goods-id'));
                if (vm.upperSelectedCount == vm.upperList.length) {
                    $('div.tools-bar.upper').find('span.checkbox').addClass('active');
                }
            } else {
                //选中上架商品的数量-1
                vm.upperSelectedCount -= 1;
                vm.allLowerId.splice(vm.allLowerId.indexOf($(this).attr('goods-id')), 1);
                $('div.tools-bar.upper').find('span.checkbox').removeClass('active');
            }
        });
        //下架的商品选中操作
        $('.goods-info.stock').click(function () {
            $(this).find('span.checkbox').toggleClass('active');
            if ($(this).find('span.checkbox').hasClass('active')) {
                //选中上架商品的数量+1
                vm.stockSelectedCount += 1;
                vm.allUpperId.push($(this).attr('goods-id'));
                if (vm.stockSelectedCount == vm.stockList.length) {
                    $('div.tools-bar.stock').find('span.checkbox').addClass('active');
                }
            } else {
                //选中上架商品的数量-1
                vm.stockSelectedCount -= 1;
                vm.allUpperId.splice(vm.allUpperId.indexOf($(this).attr('goods-id')), 1);
                $('div.tools-bar.stock').find('span.checkbox').removeClass('active');
            }
        });
    });
});

function pageLink(url) {
    mui.openWindow({
        url: url
    });
}


function getGoodsList(status, list) {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsGoodsList`,
        data: {
            status: status
        },
        async: false,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                vm[list] = data.result;
                vm.upperListTotal = data.goods_status.goods_status1;
                vm.stockListTotal = data.goods_status.goods_status2;
                vm.lowerListTotal = data.goods_status.goods_status3;
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}

/**
 * 获得协议内容
 */
function getUserProtocol() {
    $.ajax({
        url: `${rootUrl}/index/api/getProtocolInfo`,
        async: false,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                vm.protocolContent = data.result;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}

/**
 * 用户同意
 */
function userAcceptProtocol() {
    $.ajax({
        url: `${rootUrl}/index/api/getShopsGoodsProtocol`,
        async: false,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                mui.openWindow({
                    url: 'upload-goods.html?type=add'
                });
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}
/**
 * 重新拉取用户信息
 */
getUserInfo();