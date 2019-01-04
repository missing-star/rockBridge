//保存用户还是商家版的变量 currentRole:[Number 0| Number 1] 0:user 1:business
if (!parseInt(localStorage.getItem('currentRole'))) {
    localStorage.setItem('currentRole', 0);
}
//用户是否可以切换角色
if(!localStorage.getItem('switchRole')) {
    localStorage.setItem('switchRole',0);
}

//保存历史记录
if (!localStorage.getItem('historyList')) {
    var historyListValue = {
        goods: [],
        shops: []
    };
    localStorage.setItem('historyList', historyListValue);
}

function pageLink(url) {
    mui.openWindow({
        url: url
    })
}
//返回
function goBack() {
    window.history.go(-1);
}

mui('body').on('tap', 'a', function () {
    if (this.href != 'javascript:;') {
        mui.openWindow({
            url: this.href
        });
    }
});

//解析url参数
function getParams() {
    var list = location.search.substring(1).split('&');
    var param = {};
    list.forEach(function (value, index) {
        var temp = value.split('=');
        param[temp[0]] = temp[1];
    });
    return param;
}

//域名
var rootUrl = 'http://dieshiqiao.pzhkj.cn';

//将时间戳转换为时间（年-月-日）
function transformTime(timeStat) {
    var date = new Date(parseInt(timeStat * 1000));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

function replaceSpace(str) {
    //替换空格
    return str.replace(/\s+/g, "");
}

function validatePhone(phone) {
    var regPhone = /^1[34578]\d{9}$/;
    return regPhone.test(phone);
}

function limitLength(str, min, max) {
    return str.substring(min, max);
}
//倒计时
function countTime(str) {
    //获取当前时间  
    var date = new Date();
    var now = date.getTime();

    var createDate = new Date(str);

    var cre = createDate.getTime();

    //时间差  

    var leftTime = cre - now;
    //定义变量 d,h,m,s保存倒计时的时间  

    var d, h, m, s;

    if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        return `${d}天${h}小时${m}分${s}秒`;
    }
    else {
        return '';
    }
}

function validateUser() {
    if(localStorage.getItem('user') != `""`) {
        return true;
    }
    else {
        return false;
    }
}

function validateUserPhone() {
    if(JSON.parse(localStorage.getItem('user')).phone) {
        return true;
    }
    else {
        return false;
    }
}