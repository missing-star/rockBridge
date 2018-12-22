var vm = new Vue({
    el: '#app',
    data: {
        upperList: [{
                id: 0,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            },
            {
                id: 1,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            },
            {
                id: 2,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            }
        ],
        stockList: [{
                id: 0,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            },
            {
                id: 1,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            },
            {
                id: 2,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            },
            {
                id: 3,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            }
        ],
        lowerList:[
            {
                id: 0,
                order: 325321654,
                status: 0,
                thumb: 'imgs/bed1.png',
                title: '丝绒简约四件套',
                stock: 200,
                reverse: 16,
                watched: 123
            }
        ],
        comments:[1,2,4,5,5],
        upperSelectedCount: 0,
        stockSelectedCount: 0
    },
    methods: {
        selctAllUpper() {
            //选中所有上架商品
            var elem = $('div.tools-bar.upper').find('span.checkbox');
            elem.toggleClass('active');
            if (elem.hasClass('active')) {
                //（选中/取消全选）所有商品
                $('.goods-item.upper').find('span.checkbox').addClass('active');
                this.upperSelectedCount = this.upperList.length;
            } else {
                //取消全选
                $('.goods-item.upper').find('span.checkbox').removeClass('active');
                this.upperSelectedCount = 0;
            }
        },
        selctAllStock() {
            //（选中/取消全选）所有仓库商品
            var elem = $('div.tools-bar.stock').find('span.checkbox');
            elem.toggleClass('active');
            if (elem.hasClass('active')) {
                //选中所有商品
                $('.goods-item.stock').find('span.checkbox').addClass('active');
                this.stockSelectedCount = this.stockList.length;
            } else {
                //取消全选
                $('.goods-item.stock').find('span.checkbox').removeClass('active');
                this.stockSelectedCount = 0;
            }
        }
    }
});
$(function () {
    $('li.goods-tab-bar-item').click(function () {
        //切换tab页
        if (!$(this).hasClass('active')) {
            var index = Array.prototype.slice.call(document.querySelectorAll('li.goods-tab-bar-item')).indexOf(this);
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('div.goods-tab-content-item').eq(index).addClass('active');
            $('div.goods-tab-content-item').eq(index).siblings().removeClass('active');
        }
    });
    //上架的商品选中操作
    $('.goods-info.upper').click(function () {
        $(this).find('span.checkbox').toggleClass('active');
        if ($(this).find('span.checkbox').hasClass('active')) {
            //选中上架商品的数量+1
            vm.upperSelectedCount += 1;
            if (vm.upperSelectedCount == vm.upperList.length) {
                $('div.tools-bar.upper').find('span.checkbox').addClass('active');
            }
        } else {
            //选中上架商品的数量-1
            vm.upperSelectedCount -= 1;
            $('div.tools-bar.upper').find('span.checkbox').removeClass('active');
        }
    });
    //仓库的商品选中操作
    $('.goods-info.stock').click(function () {
        $(this).find('span.checkbox').toggleClass('active');
        if ($(this).find('span.checkbox').hasClass('active')) {
            //选中上架商品的数量+1
            vm.stockSelectedCount += 1;
            if (vm.stockSelectedCount == vm.stockList.length) {
                $('div.tools-bar.stock').find('span.checkbox').addClass('active');
            }
        } else {
            //选中上架商品的数量-1
            vm.stockSelectedCount -= 1;
            $('div.tools-bar.stock').find('span.checkbox').removeClass('active');
        }
    });
});

function pageLink(url) {
    mui.openWindow({
        url:url
    });
}
