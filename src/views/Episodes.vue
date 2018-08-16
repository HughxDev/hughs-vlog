<template>
  <!-- <hughs-vlog-feed id="episodes" order="desc" v-bind:src="episodesEndpoint"></hughs-vlog-feed> -->
  <div>
    <h2 class="sr-only">Episodes</h2>
    <nav>
      <details open="open">
        <summary><h3 class="h h--3 h--summary">Search</h3></summary>
        <form>
          <dl>
            <dt>
              <label for="date" v-bind:aria-label="getAccessibleLabel()">
                <input class="label__item" type="radio" v-model="searchAxis" name="searchAxis" value="date" />&nbsp;<select id="date-type" name="dateType" class="inline-select label__item" v-model="dateType" @change="onDateTypeChange">
                  <option selected="selected" value="recordedDate">Recorded</option>
                  <option value="publishedDate">Published</option>
                </select>&nbsp;<span class="label__item">Date</span>
              </label>
            </dt>
            <dd><input id="date" ref="date" v-model="date" name="date" type="date" @focus="searchAxis = 'date'" /></dd>
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
        "dateType": "recordedDate",
        "date": "",
        "searchAxis": ""
      }
    },
    "created": function created() {
      this.$http.get( this.episodesEndpoint ).then( ( data ) => {
        data.body = data.body.replace( /<video([^>]*)>/gi, '<video$1 slot="hvml" hidden="hidden">' );
        this.episodes = legacyParseXML( data.body ).documentElement.children;
        // this.episodes = data.body;
        console.log( this.episodes );
      } );
    },
    "computed": {
      "filteredEpisodes": function filteredEpisodes() {
        return this.episodes.filter( ( episode ) => {
          const query = this[this.searchAxis];
          console.log( 'query', query );
          const search = new RegExp( query, 'i' );
          const children = Array.from( episode.children );

          for ( let i = 0; i < children.length; ++i ) {
            let child = children[i];
            let match;
            let lookedIn = [];
            let nodeName = child.nodeName.toLowerCase();
            // console.log( 'query', query );

            if ( !!!query || ( query.trim() === '' ) ) {
              return true;
            }

            switch ( this.searchAxis ) {
              case 'date':
                switch ( this.dateType ) {
                  case 'recordedDate':
                    if ( nodeName === 'recorded' ) {
                      match = child.textContent.match( search );
                      return !!match;
                    } // switch nodeName
                  break;

                  case 'publishedDate':
                    if ( nodeName === 'published' ) {
                      match = child.textContent.match( search );
                      return !!match;
                    }
                  break;
                } // switch dateType
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
    "methods": {
      "getEpisodeNumber": function getEpisodeNumber( episode ) {
        const children = Array.from( episode.children );
        for (var i = 0; i < children.length; i++) {
          let child = children[i];
          if ( child.nodeName.toLowerCase() === 'episode' ) {
            return 'ep-' + child.textContent.trim();
          }
        }
      },
      "getAccessibleLabel": function getAccessibleLabel() {
        switch ( this.dateType ) {
          case 'recordedDate':
            return 'Recorded Date';
          break;

          case 'publishedDate':
            return 'Published Date';
          break;
        }
      },
      "onDateTypeChange": function onDateTypeChange( event ) {
        this.$refs.date.focus();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped="scoped">
  @import 'helpers';

  .sr-only {
    @include sr-only();
  }

  details {
    margin-bottom: 1rem;
  }

  summary {
    cursor: default;
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */

    /* Rules below not implemented in browsers yet */
    /* -o-user-select: none; */
    user-select: none;
  }

  summary::-webkit-details-marker {
    display: inline-block;
    vertical-align: middle;
  }

  .h.h--summary {
    display: inline;
    display: inline-block;
    vertical-align: middle;
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

  .inline-select {
    height: 24px;
  }

  .label__item {
    display: inline-block;
    vertical-align: middle;
  }
</style>
