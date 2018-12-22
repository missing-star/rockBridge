new Vue({
    el:'#app',
    data:{
        isFadeIn:false,
        isFadeOut:false,
        searchContent:'',
        itemList:[
            {icon:'imgs/safe.png',title:'商家认证',desc:'商品安全保障',url:'shop-auth.html'},
            {icon:'imgs/home-line.png',title:'商铺入驻',desc:'线上线下一体化',url:'shop-settled.html'},
            {icon:'imgs/setting.png',title:'在线缴费',desc:'商铺线上管理',url:'online-pay.html'},
            {icon:'imgs/phone.png',title:'联系我们',desc:'随时随地资讯',url:'contact-us.html'}
        ]
    },
    methods:{
        showSearch() {
            //打开搜索页
            this.isFadeIn = true;
            this.isFadeOut = false;
            $("input#search").focus();
        },
        hideSearch() {
            //关闭搜索页
            this.isFadeIn = false;
            this.isFadeOut = true;
        },
        clearInput() {
            //清空搜索框
            this.searchContent = '';
        },
        jumpLink(url) {
            //认证，入驻，缴费，联系我们跳转
            mui.openWindow({
                url:url
            });
        },
        goDetail(url,id) {
            //详情页
            mui.openWindow({
                url:`${url}?id=${id}`
            });
        },
        enterShop(id) {
            //进店
            mui.openWindow({
                url:`shop-detail.html?id=${id}`
            })
        }
    }
})