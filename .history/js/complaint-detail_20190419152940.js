var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {}
});

function getComplaintDetail() {
    $.ajax({
        url:`${rootUrl}/index/api/getComplainInfo`,
        data:{
            id:getParams().id
        }
    })
}