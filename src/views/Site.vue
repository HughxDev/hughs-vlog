<template>
  <hughs-vlog hidden="hidden">
    <hughs-vlog-header>
      <router-link class="logo link-wrapper" to="/" exact="exact" v-on:click.native="clearFocus">
        <h1 class="logotype h h--1">Hugh’s Vlog</h1>
        <picture class="logomark">
          <source type="image/svg+xml" srcset="../assets/hughs-vlog-logo.svg" />
          <img src="../assets/hughs-vlog-logo.png" width="190" height="70" srcset="../assets/hughs-vlog-logo.png 1x, ../assets/hughs-vlog-logo@2x.png 2x, ../assets/hughs-vlog-logo@3x.png 3x" alt="Logo: White round glasses with TV color bars in both frames" />
        </picture>
      </router-link>
      <p>The daily life of a startup founder, programmer, and filmmaker.</p>
      <hughs-vlog-site-nav nite="nite" pills="pills">
        <router-link to="/about" v-on:click.native="clearFocus">About</router-link>
        <router-link to="/episodes" v-on:click.native="clearFocus">Episodes</router-link>
        <!-- <a class="middle" href="javascript:void(0);">Companion Blog</a>  -->
        <router-link to="/subscribe" v-on:click.native="clearFocus">Subscribe</router-link>
        <router-link to="/contact" v-on:click.native="clearFocus">Contact</router-link>
      </hughs-vlog-site-nav>
    </hughs-vlog-header>
    <main>
      <div id="top" class="wrapper">
        <transition name="view-fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
      <hughs-vlog-playback-options v-show="[ 'home', 'episodes' ].indexOf( $route.name ) > -1"></hughs-vlog-playback-options>
      <hughs-vlog-episode-nav v-show="[ 'home', 'episodes' ].indexOf( $route.name ) > -1" nite="nite"></hughs-vlog-episode-nav>
    </main>
    <hughs-vlog-footer></hughs-vlog-footer>
  </hughs-vlog>
</template>
<script>
  window.fbAsyncInit = function() {
    window.FB.init( {
      "appId": "1117428231678998",
      "autoLogAppEvents": true,
      "xfbml": true,
      "version": "v2.10"
    } );

    window.FB.AppEvents.logPageView();

    // function renderFbLikeButtonWhenReady() {
    //   // If subscribe section not in nested shadow DOM, such as with polyfill:
    //   let hughsVlogSubscribe = document.querySelector( 'hughs-vlog-subscribe' );
    //
    //   // Subscribe section inaccessible; look for
    //   if ( !hughsVlogSubscribe ) {
    //     let hughsVlog = document.querySelector( 'hughs-vlog' );
    //
    //     if ( hughsVlog ) {
    //       let hughsVlogHeader = ( hughsVlog.shadowRoot ? hughsVlog.shadowRoot.querySelector( 'hughs-vlog-header' ) : hughsVlog.querySelector( 'hughs-vlog-header' ) );
    //
    //       if ( hughsVlogHeader ) {
    //         hughsVlogSubscribe = ( hughsVlogHeader.shadowRoot ? hughsVlogHeader.shadowRoot.querySelector( 'hughs-vlog-subscribe' ) : hughsVlogHeader.querySelector( 'hughs-vlog-subscribe' ) );
    //       }
    //     }
    //   }
    //
    //   hughsVlogSubscribe.renderFbLikeButton();
    // }

    function webComponentsReady() {
      // window.customElements.whenDefined( 'hughs-vlog-subscribe' ).then( renderFbLikeButtonWhenReady );
      // window.customElements.whenDefined( 'hughs-vlog' ).then( revealSite );

      return import( './components/hughs-vlog.js' );
    }

    // if ( 'ShadyCSS' in window ) {
    //   console.log( 'window.ShadyCSS', window.ShadyCSS );
    //   window.ShadyCSS.styleElement( window.document.documentElement );
    // }

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

  window.twttr = ( function ( d, s, id ) {
    var
      js,
      fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {}
    ;

    if ( d.getElementById( id ) ) {
      return t;
    }

    js = d.createElement( s );
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore( js, fjs );

    t._e = [];
    t.ready = function ( f ) {
      t._e.push( f );
    };

    return t;
  }( document, "script", "twitter-wjs" ) );

  export default {
    name: 'Site',
    props: {
      showSubscribe: false
    },
    methods: {
      goBack () {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      clearFocus: function ( event ) {
        event.currentTarget.blur();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import url(//fonts.googleapis.com/earlyaccess/notosansjp.css);

  * {
    box-sizing: border-box;
  }

  :root {
    --title-align: center;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background-image: url( '../assets/boston-skyline-vhs@0.25x.svg' );
    font-family: "Noto Sans", "Noto Sans CJK JP", sans-serif;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-color: black;
    background-position: center;
    color: white;
    font-size: 1.25rem;
  }

  @media only screen and ( min-width: 960px ) {
    body {
      background-image: url( '../assets/boston-skyline-vhs@0.5x.svg' );
    }
  }

  @media only screen and ( min-width: 1920px ) {
    body {
      background-image: url( '../assets/boston-skyline-vhs.svg' );
    }
  }

  .logo {
    font-size: 1rem;
    width: 190px;
    width: 11.875em;
    /* height: 104px; */
    height: 6.6em;
    margin: 1.25em auto;
    text-align: center;
    overflow: hidden;
  }

  .logotype,
  .logomark {
    margin: 0 auto;
  }

  .logotype {
    text-transform: lowercase;
    width: 71.89%;
    font-size: 1.5331248641em;
    margin-top: -.33333333em;
    margin-bottom: .33333333em;
    font-family: "Open Sans", "Noto Sans", "Noto Sans CJK", sans-serif;
  }

  .logomark {
    display: block;
    width: 100%;
  }

  /* Transitions */
  .view-fade-enter-active, .view-fade-leave-active {
    transition: opacity .3s ease;
  }
  .view-fade-enter, .view-fade-leave-to {
    opacity: 0;
  }

  .wrapper {
    min-height: 480px;
  }
</style>
