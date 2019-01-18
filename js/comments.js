var vm = new Vue({
    el:'#app',
    data() {
        return {
            
        }
    },
    methods: {
        getComments(type) {
            mui.openWindow({
                url:'comments-category.html?type=' + type
            });
        }
    },
})