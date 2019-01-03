var vm = new Vue({
    el: '#app',
    data: {
        isCollected: false
    },
    methods: {
        collect(flag) {
            this.isCollected = flag;
        },
        enterShop() {
            mui.openWindow({
                url: 'shop-detail.html'
            });
        }
    }
})

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
                var scalAll = (1 - Math.abs(slideProgress)* 0.2);
                //当前活动的左右两侧swiper
                if (slideProgress != 0) {
                    //X轴过渡
                    var translateX = slideProgress + 'rem';
                    slide.transform('translateX('+translateX+') scale('+scalAll+')');
                }
                else {
                    //当前活动的swiper
                    slide.transform('translateX(0) scale('+scalAll+')');
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