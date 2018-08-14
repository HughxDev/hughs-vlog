<template>
  <hughs-vlog-feed id="episodes" order="desc" v-bind:src="episodesEndpoint"></hughs-vlog-feed>
</template>

<script>
  export default {
    name: 'Episodes',
    props: {},
    data: function () {
      return {
        episodesEndpoint: process.env.VUE_APP_ROOT_API + '/feed/hvml/videos'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
