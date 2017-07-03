Vue.component('task-list', {
    template: `<ul class="list-group">
                <task v-for="task in tasks">{{task.task}}</task>
            </ul>`,
    data() {
        return {
            tasks: [
                { task: 'Go to the store', completed: false },
                { task: 'Finish', completed: false },
                { task: 'Make donation', completed: true },
                { task: 'Clear inbox', completed: false },
                { task: 'Make dinner', completed: true },
                { task: 'Clean room', completed: false }
            ]
        }
    }
})

Vue.component('task', {
    template: '<li class="list-group-item"><slot></slot></li>'
})

Vue.component('message', {
    props: ['title', 'body'],
    data() {
        return {
            isVisable: true
        }
    },
    template: `
    <div class="modal-dialog" v-show="isVisable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="defaultModalLabel">{{title}}</h4>
            </div>
            <div class="modal-body">
                {{body}}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-link waves-effect">SAVE CHANGES</button>
                <button type="button" class="btn btn-link waves-effect" @click="isVisable = false;">CLOSE</button>
            </div>
        </div>
    </div>
    `,
    // methods: {
    //     hideModal() {
    //         this.isVisable = false;
    //     }
    // }
})

Vue.component('tabs', {
    template: `
    <div>
        <ul class="nav nav-tabs tab-nav-right" role="tablist">
            <li role="presentation" class="active"><a href="#home" data-toggle="tab">HOME</a></li>
            <li role="presentation"><a href="#profile" data-toggle="tab">PROFILE</a></li>
            <li role="presentation"><a href="#messages" data-toggle="tab">MESSAGES</a></li>
            <li role="presentation"><a href="#settings" data-toggle="tab">SETTINGS</a></li>
        </ul>
    </div>

    <div class="tab-content">
        <slot></slot>
    </div>
    `,
    mounted() {
        console.log(this.$children);
    }
})