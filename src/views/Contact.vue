<template>
  <div>
    <h2 class="title h h--2">Contact</h2>
    <input type="email" value="hello@hugh.today" readonly="readonly" />
    <h3 class="h h--2">Keep up with Hugh</h3>
    <dl>
      <dt>Twitter</dt>
      <dd><a href="https://twitter.com/LordPancreas" rel="me">LordPancreas</a></dd>
      <dd><a href="https://twitter.com/RedBlueVideo" rel="me">RedBlueVideo</a></dd>
      <dd><a href="https://twitter.com/TurboHax" rel="me">TurboHax</a></dd>
    </dl>
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
