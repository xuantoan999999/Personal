var app = new Vue({
    el: '#vue-basic-5',
    data: {
        message: 'Hello World!',
        names: ['Name1', 'Name2', 'Name3', 'Name4'],
        name_add: '',
        title: 'Hover this',
        className: 'col-orange',
        isLoading: false,
    },
    methods: {
        alert: function (text) {
            window.alert(text);
        },
        addName: function () {
            if (this.name_add) {
                this.names.push(this.name_add);
                this.name_add = '';
            }
        },
        toggleClass: function () {
            this.isLoading = !this.isLoading;
        },
    },
    mounted() {
        setInterval(function () {
            $('#clock').text(moment().format('DD/MM/YY HH:mm:ss A'));
        }, 1000);
    }
})