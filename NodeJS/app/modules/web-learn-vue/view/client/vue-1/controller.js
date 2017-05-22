var app = new Vue({
    el: '#vue-basic',
    data: {
        message: 'Hello Vue Testttttt!'
    },
    methods:{
        alert: function(text){
            window.alert(text);
        }
    }
})