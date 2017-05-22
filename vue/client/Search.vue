<template>
  <div class="search-bar">
    <div class="search-icon">
        <i class="material-icons">{{msg}}</i>
    </div>
    <input type="text" placeholder="START TYPING...">
    <div class="close-search">
        <i class="material-icons">close</i>
    </div>
</div>
</template>

<script>
export default {
  data: function() {
    return {
      msg: 'search',
      api: '',
      error: {}
    }
  },
  methods: {
  }
}
</script>