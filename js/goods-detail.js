var vm = new Vue({
    el: '#app',
    data: {
        goodsInfo: ''
    },
    methods: {
        collect(flag) {
            $.ajax({
                url:`/index/api/getUserCollection`,
                type:'post',
                dataType:'json',
                data:{
                    type:2,
                    id:vm.goodsInfo.goods.id,
                },
                success:function(data) {
                    mui.toast(data.msg);
                    if(data.status == 1) {
                        vm.goodsInfo.goods.is_collection = flag;
                    }
                },
                error:function() {
                    mui.toast('服务器异常');
                }
            });
        },
        enterShop(id) {
            mui.openWindow({
                url: 'shop-detail.html?id=' + id
            });
        }
    },
    filters: {
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
});

function initBanner() {
    var swiper = new Swiper('.swiper-container', {
        watchSlidesProgress: true,
        centeredSlides: true,
        slidesPerView: 1.2,
        initialSlide: 0,
        on: {
            progress: function (progress) {
                for (i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i);
                    var slideProgress = this.slides[i].progress;
                    //缩放过渡
                    var scalAll = (1 - Math.abs(slideProgress) * 0.2);
                    //当前活动的左右两侧swiper
                    if (slideProgress != 0) {
                        //X轴过渡
                        var translateX = slideProgress + 'rem';
                        slide.transform('translateX(' + translateX + ') scale(' + scalAll + ')');
                    } else {
                        //当前活动的swiper
                        slide.transform('translateX(0) scale(' + scalAll + ')');
                    }
                }
            },
            setTransition: function (transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }

            }
        }
    });
}


getGoodsDetail(getParams().id);

function getGoodsDetail(id) {
    const data = {
        id:id
    }
    if(getParams().ad_id) {
        data.ad_id = getParams().ad_id
    }
    $.ajax({
        url: `${rootUrl}/index/api/getGoodsInfo`,
        data: data,
        async: false,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                vm.goodsInfo = data.result;
                vm.$nextTick(function() {
                    initBanner();
                });
            }
        },
        error: function () {
            mui.toast('服务器异常');
        }
    });
}