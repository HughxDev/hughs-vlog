<template>
  <!-- <hughs-vlog-feed id="episodes" order="desc" v-bind:src="episodesEndpoint"></hughs-vlog-feed> -->
  <div>
    <nav>
      <details open="open">
        <summary><h2 class="h h--2 h--summary">Search</h2></summary>
        <form>
          <dl>
            <dt>
              <label for="recorded-date">
                <input type="radio" v-model="searchAxis" name="searchAxis" value="recordedDate" />&nbsp;<span class="label__text">Recorded Date</span>
              </label>
            </dt>
            <dd><input id="recorded-date" v-model="recordedDate" name="recordedDate" type="date" @focus="searchAxis = 'recordedDate'" /></dd>
            <dt>
              <label for="published-date">
                <input type="radio" v-model="searchAxis" name="searchAxis" value="publishedDate" />&nbsp;<span class="label__text">Published Date</span>
              </label>
            </dt>
            <dd><input id="published-date" v-model="publishedDate" name="publishedDate" type="date" @focus="searchAxis = 'publishedDate'" /></dd>
            <dt>
              <label for="terms">
                <input type="radio" v-model="searchAxis" name="searchAxis" value="terms" />&nbsp;<span class="label__text">Terms</span>
              </label>
            </dt>
            <dd><input id="terms" v-model="terms" name="terms" type="search" @focus="searchAxis = 'terms'" /></dd>
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
    "name": "Episodes",
    "props": {},
    "data": function data() {
      return {
        "episodesEndpoint": ( process.env.VUE_APP_ROOT_API ) + '/feed/hvml/videos',
        "terms": "",
        "episodes": [],
        "recordedDate": "",
        "publishedDate": "",
        "searchAxis": ""
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
          const query = this[this.searchAxis];
          const search = new RegExp( query, 'i' );
          const children = Array.from( episode.children );

          for ( let i = 0; i < children.length; ++i ) {
            let child = children[i];
            let match;
            let lookedIn = [];
            let nodeName = child.nodeName.toLowerCase();

            if ( !!!query || ( query.trim() === '' ) ) {
              return true;
            }

            switch ( this.searchAxis ) {
              case 'recordedDate':
                switch ( nodeName ) {
                  case 'recorded':
                    match = child.textContent.match( search );
                    return !!match;
                  break;
                }
              break;

              case 'publishedDate':
                switch ( nodeName ) {
                  case 'published':
                    match = child.textContent.match( search );
                    return !!match;
                  break;
                }
              break;

              case 'terms':
                switch ( nodeName ) {
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

  dt {
    margin-bottom: 0.5rem;
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

  [type="date"],
  [type="search"],
  [type="text"] {
    border: none;
    height: 2.5rem;
    padding: 0.5rem;
    font-size: 1.1rem;
  }

  [type="radio"],
  [type="radio"] + .label__text {
    display: inline-block;
    vertical-align: middle;
  }
</style>
