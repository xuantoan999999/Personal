<template>
  <div id="app">
    <message>Hello world</message>
    <message>Hello world saf as</message>
    <message>Hello worldf as f</message>
    <message>Hello worlda sf</message>
    <counter></counter>
  </div>
</template>

<script>
import Message from './components/Message.vue'
import Counter from './components/Counter.vue'
export default {
  name: 'app',
  components:{ Message , Counter},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">

</style>
