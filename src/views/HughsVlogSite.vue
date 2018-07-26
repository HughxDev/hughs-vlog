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
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <hughs-vlog-playback-options></hughs-vlog-playback-options>
      <hughs-vlog-episode-nav></hughs-vlog-episode-nav>
    </main>
    <hughs-vlog-footer></hughs-vlog-footer>
  </hughs-vlog>
</template>

<script>
  window.fbAsyncInit = function() {
    window.FB.init( {
      "appId": "1117428231678998",
      "autoLogAppEvents": true,
      "xfbml": false,
      "version": "v2.10"
    } );

    window.FB.AppEvents.logPageView();

    // console.log( 'wtf' );

    function renderFbLikeButtonWhenReady() {
      // If subscribe section not in nested shadow DOM, such as with polyfill:
      let hughsVlogSubscribe = document.querySelector( 'hughs-vlog-subscribe' );

      // Subscribe section inaccessible; look for
      if ( !hughsVlogSubscribe ) {
        let hughsVlog = document.querySelector( 'hughs-vlog' );

        if ( hughsVlog ) {
          let hughsVlogHeader = ( hughsVlog.shadowRoot ? hughsVlog.shadowRoot.querySelector( 'hughs-vlog-header' ) : hughsVlog.querySelector( 'hughs-vlog-header' ) );

          if ( hughsVlogHeader ) {
            hughsVlogSubscribe = ( hughsVlogHeader.shadowRoot ? hughsVlogHeader.shadowRoot.querySelector( 'hughs-vlog-subscribe' ) : hughsVlogHeader.querySelector( 'hughs-vlog-subscribe' ) );
          }
        }
      }

      hughsVlogSubscribe.renderFbLikeButton();
    }

    function webComponentsReady() {
      window.customElements.whenDefined( 'hughs-vlog-subscribe' ).then( renderFbLikeButtonWhenReady );

      return import( './components/hughs-vlog.js' );
    }

    if ( ( 'WebComponents' in window ) && ( 'waitFor' in window.WebComponents ) ) {
      // console.log( 'waitFor' );
      window.WebComponents.waitFor( webComponentsReady );
    } else {
      // console.log( 'no waitFor' );
      webComponentsReady();
    }
  };

  ( function loadFacebookSDK( d, s, id ) {
    var js, fjs = d.getElementsByTagName( s )[0];

    if ( d.getElementById( id ) ) {
      return;
    }

    js = d.createElement( s );
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";

    fjs.parentNode.insertBefore( js, fjs );
  }( document, 'script', 'facebook-jssdk' ) );

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
