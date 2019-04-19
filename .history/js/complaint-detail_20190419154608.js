var vm = new Vue({
    el: '#app',
    data: {
        detail:{"status":1,"msg":"投诉建议详情","result":{"id":4,"user_id":24,"role_id":"认证部","admin_id":"admin2","content":"希望越来越好","images":"/upload///2019-04-19/5cb97b6b06951.jpg,/upload///2019-04-19/5cb97b6e28b4a.jpg","type":1,"status":1,"add_time":"2019-04-19","update_time":"1970-01-01"}}
    },
    methods: {
        getComplaintDetail() {
            var that = this;
            $.ajax({
                url:`${rootUrl}/index/api/getComplainInfo`,
                type:'post',
                dataType:'json',
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
