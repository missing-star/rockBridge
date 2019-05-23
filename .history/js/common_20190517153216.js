//保存用户还是商家版的变量 currentRole:[Number 0| Number 1] 0:user 1:business
if (!parseInt(sessionStorage.getItem('currentRole'))) {
    sessionStorage.setItem('currentRole', 0);
}
//用户是否可以切换角色
if (!sessionStorage.getItem('switchRole')) {
    sessionStorage.setItem('switchRole', 0);
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

// 商家可选背景图列表
var bgList = [1,2,3,4,5];

// 当前商家背景图下标
var currentBg = 0;

localStorage.setItem('bgList',JSON.stringify(bgList));

if(!localStorage.getItem('currentBg')) {
    localStorage.setItem('currentBg',currentBg);
}
// 商家历史记录
if(!localStorage.getItem('bgHistory')) {
    localStorage.setItem('bgHistory','[]');
}

//将时间戳转换为时间（年-月-日）
function transformTime(timeStat,flag) {
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
    var hour = date.getHours();
    if(hour < 10) {
        hour = '0' + hour;
    }
    var minute = date.getMinutes();
    if(minute < 10) {
        minute = '0' + minute;
    }
    var second = date.getSeconds();
    if(second < 10) {
        second = '0' + second;
    }
    if(flag) {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' +second;
    }
    return year + '-' + month + '-' + day;
}

function replaceSpace(str) {
    //替换空格
    return str.replace(/\s+/g, "");
}

function validatePhone(phone) {
    var regPhone = /^1\d{9}\d$/;
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
    } else {
        return '';
    }
}

function validateUser() {
    if (sessionStorage.getItem('user') && sessionStorage.getItem('user') != `""`) {
        return true;
    } else {
        return false;
    }
}

function validateUserPhone() {
    if (JSON.parse(sessionStorage.getItem('user')).users.phone) {
        return true;
    } else {
        return false;
    }
}

function sortByPro(pro, flag) {
    //flag:true=>升序 false:降序
    return function (a, b) {
        return function (a, b) {
            return flag ? a[prop] - b[prop] : b[prop] - a[prop];
        }
    }
}

/**
 * 获得历史搜索记录
 */

 function getSearchHistory() {
     var result = [];
     $.ajax({
         url:`${rootUrl}/index/api/getSerachLog`,
         async:false,
         type:'post',
         success:function(data) {
            result = data.result.map(function(item,i) {
                return item.keywords;
            });
         },
         error:function() {
             mui.toast('服务器异常');
         }
     });
     return result;
 }

 function goLogin(type) {
     if(type == 1) {
         //维修员
        mui.openWindow({
            url:`${rootUrl}/index/api/getWxLogin`
        });
        }
     else {
         //商户
        mui.openWindow({
            url:`${rootUrl}/index/api/getWxRepairmanLogin`
        }); 
     }
 }

 
function getUserInfo() {
    $.ajax({
        url: `${rootUrl}/index/api/getMyCenter`,
        type: 'post',
        async: false,
        datType: 'json',
        success: function (data) {
            if (data.status == 1) {
                sessionStorage.setItem('user', JSON.stringify(data.result));
                userData = data.result;
                if (data.result.shop_id > 0) {
                    sessionStorage.setItem('switchRole', 1);
                } else {
                    sessionStorage.setItem('switchRole', 0);
                }
            } else if (data.status == 202) {
                goLogin();
            }
        },
        error: function () {
            mui.toast('服务器异常！');
        }
    })
}



function testProp() {
    mui('#sheet1').popover('toggle');
}