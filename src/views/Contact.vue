<template>
  <div>
    <!-- <h2 class="title h h--2">Contact</h2> -->
    <input type="email" value="hello@hugh.today" readonly="readonly" />
  </div>
</template>

<script>
  export default {
    name: 'Contact',
    props: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    text-align: center;
  }
  input {
    font-size: 1.5rem;
  }
</style>
