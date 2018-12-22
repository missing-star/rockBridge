new Vue({
    el:'#app',
    data:{
        currentRole:localStorage.getItem('currentRole'),
        userData:undefined
    },
    methods:{
        //切换用户角色
        switchRole() {
            if(this.currentRole == 0) {
                localStorage.setItem('currentRole',1);
            }
            else {
                localStorage.setItem('currentRole',0);
            }
            this.currentRole = localStorage.getItem('currentRole');
            //重新获取数据
            getData();
        }
    },
    created() {
        
    }
});

getData();

/**
 * 主入口函数
 */
function getData() {
    switch(parseInt(localStorage.getItem('currentRole'))) {
        case 0:
            getUserInfo();
            break;
        case 1:
            getBusinessInfo();
            break;
    }
}

/**
 * 获取普通用户信息
 */
function getUserInfo() {
    console.log('user');
}

/**
 * 获取商家信息
 */
function getBusinessInfo() {
    console.log('business');
}