<template>
  <hughs-vlog id="app">
    <hughs-vlog-header>
      <router-link class="link-wrapper" to="/">
        <h1 class="h h--1">Hugh’s Vlog</h1>
      </router-link>
      <p>The daily life of a startup founder, programmer, and filmmaker.</p>
      <hughs-vlog-site-nav>
        <a href="javascript:void(0);">About</a>
        <router-link to="/episodes">Episodes</router-link>
        <!-- <a class="middle" href="javascript:void(0);">Companion Blog</a>  -->
        <a href="javascript:void(0);">Contact</a>
      </hughs-vlog-site-nav>
      <hughs-vlog-subscribe></hughs-vlog-subscribe>
    </hughs-vlog-header>
    <main>
      <h2>It works!</h2>
      <!-- <slot></slot> -->
      <router-view></router-view>
      <hughs-vlog-playback-options></hughs-vlog-playback-options>
      <hughs-vlog-episode-nav></hughs-vlog-episode-nav>
    </main>
    <hughs-vlog-footer></hughs-vlog-footer>
  </hughs-vlog>
</template>

<script>
  export default {
    name: 'HughsVlogHomepage',
    props: {
      msg: String
    },
    computed: {
      username () {
        // We will see what `params` is shortly
        return this.$route.params.username
      }
    },
    methods: {
      goBack () {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
