<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>Tài khoản</h2>
                </div>
                <div class="body" id="account">
                    <p v-text="message"></p>
                    {{message}} asfasf
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        data(){
            return {
                message: 'Hello World!',
            }
        },
        mounted() {
        },
        methods: {
            
        }
    }
</script>
