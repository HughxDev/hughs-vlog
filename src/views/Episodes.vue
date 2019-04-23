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
                <input class="label__item label__radio" type="radio" v-model="searchAxis" name="searchAxis" value="date" />&nbsp;<select id="date-type" name="dateType" class="inline-select label__item label__select" v-model="dateType" @change="onDateTypeChange">
                  <option selected="selected" value="recordedDate">Recorded</option>
                  <option value="publishedDate">Published</option>
                </select>&nbsp;<span class="label__item label__text">Date</span>
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
    <!-- <div class="episode-container"> -->
    <!-- <hughs-vlog-feed id="episodes" delegated="delegated"> -->
    <transition-group
      id="episodes"
      class="episodes"
      name="episode"
      tag="hughs-vlog-feed"
      delegated="delegated"
      v-bind:css="true"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
    >
      <template v-for="episode in filteredEpisodes">
        <hughs-vlog-feed__entry :key="getEpisodeNumber(episode)" class="episode" v-html="episode.outerHTML"></hughs-vlog-feed__entry>
      </template>
    </transition-group>
    <!-- </hughs-vlog-feed> -->
    <!-- </div> -->
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
        console.log( 'created::this.episodes', this.episodes );
      } );
    },
    "computed": {
      "filteredEpisodes": function filteredEpisodes() {
        console.log( 'filteredEpisodes::this.episodes', this.episodes );

        return this.episodes.filter( ( episode ) => {
          const query = this[this.searchAxis];
          const search = new RegExp( query, 'i' );
          const children = Array.from( episode.children );

          for ( let i = 0; i < children.length; ++i ) {
            if ( !!!query || ( query.trim() === '' ) ) {
              return true;
            }

            let child = children[i];
            let match;
            let lookedIn = [];
            let nodeName = child.nodeName.toLowerCase();
            // console.log( 'query', query );

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
      },
      // beforeEnter: function (el) {},
      // enter: function (el, done) {},
      beforeLeave: function ( el, done ) {
        const { marginLeft, marginTop, width, height } = window.getComputedStyle( el );

        const newLeft = `${el.offsetLeft - parseFloat( marginLeft, 10 )}px`;
        const newTop = `${el.offsetTop - parseFloat( marginTop, 10 )}px`;

        console.log( '---------' );

        console.log( el.id );

        console.log( 'el.offsetLeft', el.offsetLeft );
        console.log( 'newLeft', newLeft );

        console.log( 'el.offsetTop', el.offsetTop );
        console.log( 'newTop', newTop );

        el.style.left = newLeft;
        el.style.top = newTop;
        // el.style.width = width;
        // el.style.height = height;
        // done();
        // console.log( 'done', done );
      },
      leave: function ( el, done ) {
        var delay = el.dataset.index * 150;
        setTimeout( function () {
          el.style.top = 0;
          el.style.left = 0;
        }, delay );
        setTimeout( function () {
          el.style.opacity = 0;
        }, ( delay * 2 ) );
      },
      // afterLeave: function ( el, done ) {
      //   // el.style.removeProperty( 'left' );
      //   // el.style.removeProperty( 'top' );
      //   // el.style.removeProperty( 'width' );
      //   // el.style.
      //   done();
      // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped="scoped">
  @import 'helpers';

  .episodes {
    position: relative;
    // margin-top: 1rem;
    // padding-right: 1rem;
    // padding-bottom: 5rem;
    backface-visibility: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    // minheight:
    // transition: height 8000ms ease-in-out;
    margin: -.25rem;
  }

  /* base */
  .episode {
    position: relative;
    // position: absolute;
    // width: calc(100% / 2 - 1rem);
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
    // margin-left: 1rem;
    // margin-top: 1rem;
    // padding-top: 0.75rem;
    border-radius: .3rem;
    // background-color: white;
    // box-shadow: 0 0 0 1px #c5d0d1;
    backface-visibility: hidden;
    transform-origin: 10% 50%;
    // z-index: 1;
    // ----------------------------
    // top: 0;
    // left: 0;
    // width: 50%;
    // width: calc(50% - .5rem);
    // margin: .25rem;
    // flex-basis: calc(50% - .5rem);
    // height: 14.7131rem;

    &-move {
      transition: all 4800ms ease-in-out 400ms; /* development */
      transition: all 600ms ease-in-out 50ms;
    }

    &-enter-active {
      transition: all 2400ms ease-out; /* development */
      transition: all 400ms ease-out;
    }

    &-leave-active {
      transition: all 1600ms ease-in; /* development */
      transition: all 200ms ease-in;
      position: absolute;
      z-index: 0;
    }

    &-enter,
    &-leave-to {
      // opacity: 0;
    }

    &-enter {
      transform: scale(0.9);
    }
  }

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

  .label__item {
    display: inline-block;
    vertical-align: middle;
  }

  // .label__select {}
  .inline-select {
    height: 24px;
    vertical-align: baseline;
  }

  .label__radio {
    margin-top: 0;
    margin-bottom: 0;
    // vertical-align: text-bottom;
  }

  // .label__text {
  //   vertical-align: middle;
  // }
</style>
