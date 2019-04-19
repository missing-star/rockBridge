var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        getComplaintDetail() {
            var that = this;
            $.ajax({
                url:`${rootUrl}/index/api/getComplainInfo`,
                data:{
                    id:getParams().id
                },
                success:function(data) {
                    if(data.status == 1) {
                        that.detail = data.result;
                    }
                    else {
                        mui.toast(data.msg);
                    }
                }
            })
        }
    },
    created() {
        this.getComplaintDetail();
    },
});
