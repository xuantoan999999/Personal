

var app = new Vue({
    el: '#vue-basic-2',
    data: {
        message: 'Hello World',
        tasks: [
            { description: 'Go to the store', completed: false },
            { description: 'Finish', completed: false },
            { description: 'Make donation', completed: true },
            { description: 'Clear inbox', completed: false },
            { description: 'Make dinner', completed: true },
            { description: 'Clean room', completed: false }
        ]
    },
    methods: {

    },
    computed: {
        reversedMessage() {
            return this.message.split('').reverse().join('')
        },
        incompleteTasks() {
            return this.tasks.filter(task => !task.completed);
        }
    },
    mounted() {
    }
})

