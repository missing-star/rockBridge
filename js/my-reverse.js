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
        ]
    },
    methods: {
        
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
});

function pageLink(url) {
    mui.openWindow({
        url:url
    });
}
