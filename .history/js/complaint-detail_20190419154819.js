var vm = new Vue({
    el: '#app',
    data: {
        detail: {
            add_time: "2019-04-19",
            admin_id: "admin2",
            content: "希望越来越好",
            id: 4,
            images: "/upload///2019-04-19/5cb97b6b06951.jpg,/upload///2019-04-19/5cb97b6e28b4a.jpg",
            role_id: "认证部",
            status: 1,
            type: 1,
            update_time: "1970-01-01",
            user_id: 24
        }
    },
    methods: {
        getComplaintDetail() {
            var that = this;
            $.ajax({
                url: `${rootUrl}/index/api/getComplainInfo`,
                type: 'post',
                dataType: 'json',
                data: {
                    id: getParams().id
                },
                success: function (data) {
                    if (data.status == 1) {
                        that.detail = data.result;
                    } else {
                        mui.toast(data.msg);
                    }
                }
            })
        }
    },
    filters:{
        filterImg(thumb) {
            thumb = thumb == null ? '' : thumb;
            if(thumb.indexOf('http') != -1) {
                return `${thumb}`;
            }
            return `${rootUrl}${thumb}`;
        }
    }
    created() {
        this.getComplaintDetail();
    },
});