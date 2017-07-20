<template>

</template>

<script>
    import Vue from 'vue'

    if (document.getElementById('account')) {
        var acccount = new Vue({
            el: '#account',
            data: {
                message: 'Hello World!',
            },
        })
    }
</script>
