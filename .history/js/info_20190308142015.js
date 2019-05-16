var page = 1;
var vm = new Vue({
    el: '#app',
    data: {
        currentRole: sessionStorage.getItem('currentRole'),
        tab: [],
        tabContent: [],
        currentTab: '',
        isMore: true,
        showCounts: 0
    },
    methods: {
        getInfoDetail(id) {
            mui.openWindow({
                url: 'info-detail.html?id=' + id
            });
        },
        switchTab(id, event) {
            if (!$(event.target).hasClass('active')) {
                $(event.target).addClass('active');
                $(event.target).siblings().removeClass('active');
                //模拟重新获取数据
                vm.tabContent = [];
                vm.isMore = true;
                getNewsByCat(page,id);
                //滚动到顶部
                $(window).scrollTop(0);
                vm.$nextTick(function () {
                    waterFall();
                });
            }
        }
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
    }
});

window.onload = function () {

    /**
     * 滚动加载
     */

    window.onscroll = function () {
        if (document.querySelector('div.bottom-line').getBoundingClientRect().top < document.documentElement.clientHeight) {
            if (!vm.isMore) return;
            getNewsByCat(++page, vm.currentTab);
        }

    };

    //入口函数
    getCategory();
};
// 封装成一个函数
function waterFall() {
    var box = document.querySelector('ul.info-list');
    var items = box.children;
    // 定义每一列之间的间隙 为10像素
    var gap = 0;
    // 1- 确定列数  = 页面的宽度 / 图片的宽度
    var pageWidth = getClient().width;
    var itemWidth = items[0].offsetWidth;
    var columns = 2;
    var arr = [];
    for (var i = 0; i < items.length; i++) {
        if (i < columns && !(items.length == 2 && i == 1)) {
            // 2- 确定第一行
            items[i].style.top = 0;
            items[i].style.left = (itemWidth + gap) * i + 'px';
            arr.push(items[i].offsetHeight);
        } else {
            // 其他行
            // 3- 找到数组中最小高度  和 它的索引
            var minHeight = arr[0];
            var index = 0;
            for (var j = 0; j < arr.length; j++) {
                if (minHeight > arr[j]) {
                    minHeight = arr[j];
                    index = j;
                }
            }
            // 4- 设置下一行的第一个盒子位置
            // top值就是最小列的高度 + gap
            if (items[i].classList[0] != 'bottom-line') {
                items[i].style.top = arr[index] + 'px';
                // left值就是最小列距离左边的距离
                items[i].style.left = items[index].offsetLeft + 'px';
                // 5- 修改最小列的高度 
                // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
                arr[index] = arr[index] + items[i].offsetHeight + gap;
            } else {
                if (i == 1) {
                    items[i].style.top = arr[index] + 'px';
                } else {
                    items[i].style.top = arr[1 - index] + 'px';
                }
                items[i].style.marginTop = '1rem';
                items[i].style.marginBottom = '3rem';
            }

        }
    }

}
// clientWidth 处理兼容性
function getClient() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}
// scrollTop兼容性处理
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * 获得新闻分类列表
 */
function getCategory() {
    $.ajax({
        url: `${rootUrl}/index/api/getArticleCate`,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                vm.tab = data.result;
                //获得第一个tab内容
                getNewsByCat(1, data.result[0].id);
                vm.currentTab = data.result[0].id;
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}

/**
 * 获得新闻列表
 */
function getNewsByCat(page, cat_id) {
    $.ajax({
        url: `${rootUrl}/index/api/getArticleList`,
        type: 'post',
        async: false,
        data: {
            page: page,
            cat_id: cat_id
        },
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                if (data.result.length == 0) {
                    vm.isMore = false;
                    return false;
                }
                vm.tabContent = vm.tabContent.concat(data.result);

                vm.$nextTick(function () {
                    //渲染后重新布局
                    loadedImgs();
                });
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    })
}
/**
 * 判断是否加载完图片
 */

function loadedImgs() {
    vm.showCounts = 0;
    //图片加载完成后开始进行重新布局
    var imgList = document.querySelectorAll('img.info-item-img');
    for (var i = 0; i < imgList.length; i++) {
        imgList[i].onload = function () {
            vm.showCounts += 1;
            if (vm.showCounts == imgList.length) {
                waterFall();
            }
        }
        imgList[i].onerror = function () {
            vm.tabContent[i].thumb = 'imgs/info-item.png';
        }

    }
}