var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        var that = this;
        getComplaintDetail() {
            $.ajax({
                url:`${rootUrl}/index/api/getComplainInfo`,
                data:{
                    id:getParams().id
                },
                success:function(data) {
                    that.detail = data.result;
                }
            })
        }
    }
});
