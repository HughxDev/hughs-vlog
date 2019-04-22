<template>
  <div class="wrapper">
    <hughs-vlog-episode id="latest-episode" published="latest"></hughs-vlog-episode>
    <hughs-vlog-playback-options></hughs-vlog-playback-options>
    <hughs-vlog-episode-nav nite="nite" pills="pills" latest="latest"></hughs-vlog-episode-nav>
  </div>
</template>

<script>
  export default {
    name: 'Homepage',
    props: {},
    mounted: function () {
      console.log( 'process.env.VUE_APP_ROOT_API', process.env.VUE_APP_ROOT_API );
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  a,
  a:hover,
  a:focus,
  a:active,
  a:visited {
    /* color: #DFDF2A; */
    color: hsl(60, 100%, 50%);
    color: hsl(310, 100%, 70%);
    text-decoration: none;
  }

  a:hover,
  a:focus {
    text-decoration: underline;
  }
</style>
