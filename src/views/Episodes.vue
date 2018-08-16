<template>
  <!-- <hughs-vlog-feed id="episodes" order="desc" v-bind:src="episodesEndpoint"></hughs-vlog-feed> -->
  <div>
    <nav>
      <details open="open">
        <summary><h2 class="h h--2 h--summary">Search</h2></summary>
        <form>
          <dl>
            <dt><label for="recorded-date">Recorded Date</label></dt>
            <dd><input id="recorded-date" name="recordedDate" type="date" /></dd>
            <dt><label for="published-date">Published Date</label></dt>
            <dd><input id="published-date" name="publishedDate" type="date" /></dd>
            <dt><label for="terms">Terms</label></dt>
            <dd><input id="terms" v-model="search" name="terms" type="search" /></dd>
          </dl>
        </form>
      </details>
    </nav>
    <hughs-vlog-feed id="episodes" delegated="delegated">
      <template v-for="episode in filteredEpisodes">
        <hughs-vlog-feed__entry :key="getEpisodeNumber(episode)" v-html="episode.outerHTML"></hughs-vlog-feed__entry>
      </template>
    </hughs-vlog-feed>
  </div>
</template>

<script>
  import { legacyParseXML } from '../lib/dom.js';

  export default {
    name: 'Episodes',
    props: {},
    data: function () {
      return {
        episodesEndpoint: ( process.env.VUE_APP_ROOT_API ) + '/feed/hvml/videos',
        search: '',
        episodes: []
      }
    },
    created: function () {
      this.$http.get( this.episodesEndpoint ).then( ( data ) => {
        data.body = data.body.replace( /<video([^>]*)>/gi, '<video$1 slot="hvml" hidden="hidden">' );
        this.episodes = legacyParseXML( data.body ).documentElement.children;
        // this.episodes = data.body;
        console.log( this.episodes );
      } );
    },
    computed: {
      filteredEpisodes: function () {
        return this.episodes.filter( ( episode ) => {
          const search = new RegExp( this.search, 'i' );
          const children = Array.from( episode.children );

          for ( let i = 0; i < children.length; ++i ) {
            let child = children[i];
            let match;
            let lookedIn = [];

            if ( this.search.trim() === '' ) {
              return true;
            }

            switch ( child.nodeName.toLowerCase() ) {
              case 'title':
                match = child.textContent.match( search );
                lookedIn.push( 'title' );
                if ( match || ( lookedIn.indexOf( 'description' ) > -1 ) ) {
                  return !!match;
                }
              break;

              case 'description':
                match = child.textContent.match( search );
                lookedIn.push( 'description' );
                if ( match || ( lookedIn.indexOf( 'title' ) > -1 ) ) {
                  return !!match;
                }
              break;
            }
          }
        } );
      }
    },
    methods: {
      getEpisodeNumber: function ( episode ) {
        const children = Array.from( episode.children );
        for (var i = 0; i < children.length; i++) {
          let child = children[i];
          if ( child.nodeName.toLowerCase() === 'episode' ) {
            return 'ep-' + child.textContent.trim();
          }
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  summary {
    cursor: default;
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */

    /* Rules below not implemented in browsers yet */
    -o-user-select: none;
    user-select: none;
  }

  .h.h--summary {
    display: inline;
    display: inline-block;
    margin: 0;
  }

  dd {
    margin-left: 0;
    margin-bottom: 1rem;
  }

  [type="search"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
  }

  input {
    border: none;
    height: 2.5rem;
    padding: 0.5rem;
    font-size: 1.1rem;
  }
</style>
