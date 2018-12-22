var vm = new Vue({
    el: '#app',
    data: {
        selectedClassify:'',
        isNext:false
    },
    methods: {
        goDetail() {
            mui.openWindow({
                url:'pay-detail.html'
            })
        },
        getNext() {
            this.isNext = true;
        }
    }
});
(function ($, doc) {
    $.init();
    $.ready(function () {
        console.log(13213);
        //电费类型选择
        var classifyPicker = new $.PopPicker();
        classifyPicker.setData(['电费', '房租']);
        var eventBtn = doc.getElementById('classify');
        eventBtn.addEventListener('tap', function (event) {
            classifyPicker.show(function (items) {
                vm.selectedClassify = items[0];
            });
        }, false);
    });
})(mui, document);