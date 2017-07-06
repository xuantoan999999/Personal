window.Event = new class {
    constructor() {
        this.vue = new Vue();
    }
    fire(event, data = null) {
        this.vue.$emit(event, data);
    }
    listten(event, callback) {
        this.vue.$on(event, callback);
    }
};

Vue.component('coupon', {
    template: `
    <div class="form-group">
        <div class="form-inline">
            <input placeholder="Enter your coupon code" @blur="onCouponApplied" class="form-control">
        </div>
    </div>
    `,
    methods: {
        onCouponApplied() {
            // this.$emit('applied');
            Event.fire('applied')
        }
    },
})

Vue.component('template-demo', {
    template: `
    <div>
        <div id="content">
            <h3><slot name="header"></slot></h3>
        </div>
        <slot>JF fjab sfjbas </slot>
    </div>
    `,
    methods: {
        onCouponApplied() {
            // this.$emit('applied');
            Event.fire('applied')
        }
    },
})

var app = new Vue({
    el: '#vue-basic-3',
    data: {
        couponApplied: false
    },
    methods: {
        onCouponApplied() {
            this.couponApplied = true;
        }
    },
    created() {
        Event.listten('applied', () => alert('Handled it '));
    },
    mounted() {

    }
})