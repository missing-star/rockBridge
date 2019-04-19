var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
        getComplaintDetail() {
            $.ajax({
                url:`${rootUrl}/index/api/getComplainInfo`,
                data:{
                    id:getParams().id
                },
                success:function(data) {
                    
                }
            })
        }
    }
});
