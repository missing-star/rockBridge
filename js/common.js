//保存用户还是商家版的变量 currentRole:[Number 0| Number 1] 0:user 1:business
if (!parseInt(localStorage.getItem('currentRole'))) {
    localStorage.setItem('currentRole', 0);
}

//返回
function goBack() {
    window.history.go(-1);
}

mui('body').on('tap', 'a.mui-tab-item', function () {
    if(this.href != 'javascript:;') {
        mui.openWindow({
            url:this.href
        });
    }
});