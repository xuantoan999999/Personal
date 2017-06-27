var app = new Vue({
    el: '#vue-basic-3',
    data: {
        
    },
    methods: {
        
    },
    mounted() {
        setInterval(function () {
            $('#clock').text(moment().format('DD/MM/YY HH:mm:ss A'));
        }, 1000);
    }
})