<template>
  <div>
    <h1>{{ msg }}</h1>
    <button class="button" v-on:click="helloCall()">Call API</button>
    <p>API says: {{ api }}</p>
    <button class="btn btn-success">Bootstrap button</button>
  </div>
</template>

<script>
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'

export default {
  data: function() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Welcome!',
      api: '',
      error: {}
    }
  },
  methods: {
    helloCall: function() {
      axios.get('/api/call').then((response) => {
        this.api = response.data.message
      }, (response) => {
        this.error = response.data
      })
    }
  }
}
</script>