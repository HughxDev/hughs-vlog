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
    <hughs-vlog-feed id="episodes" order="desc">
      <template v-for="episode in filteredEpisodes">
        <!-- @todo:
          This is a rather convoluted algorithm for passing data:

          1. We fetch XML (as a string) from the Hugh’s Vlog API.
          2. The XML is parsed into a DOM tree.
          3. The DOM tree is encoded as plain JSON.
          4. The plain JSON is converted to a string.
          5. The string is set as an attribute of the Web Component.
          6. The Web Component converts the string back into JSON.
          7. The JSON is converted back into a DOM tree.
          8. The DOM tree is assigned as a property of the Web Component.
          9. To populate the view, XPath is run against the DOM tree property.

          The API should probably just return JSON-LD if requested.
        -->
        <hughs-vlog-feed__entry :key="getEpisodeNumber(episode)" :data="JSON.stringify( DOMtoJSON( episode ) )"></hughs-vlog-feed__entry>
      </template>
    </hughs-vlog-feed>
  </div>
</template>

<script>
  export default {
    name: 'Episodes',
    props: {},
    data: function () {
      return {
        episodesEndpoint: ( 'http://api.hugh.today' || process.env.VUE_APP_ROOT_API ) + '/feed/hvml/videos',
        search: '',
        episodes: []
      }
    },
    created: function () {
      this.$http.get( this.episodesEndpoint ).then( ( data ) => {
        this.episodes = this.parseXml( data.body ).documentElement.children;
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

            if ( this.search.trim() === '' ) {
              return true;
            }

            switch ( child.nodeName.toLowerCase() ) {
              case 'title':
                match = child.textContent.trim().match( search );
                // if ( match ) {
                //   return true;
                // }
                if ( match ) {
                  console.log( this.search );
                  console.log( child.nodeName, child.textContent.trim() );
                  console.log( [child.parentNode] );
                  console.log( '---' );
                }

                return !!match;
              break;

              // case 'description':
              //   match = child.textContent.trim().match( search );
              //   console.log( child.nodeName, child.textContent.trim() );
              //   console.log( 'match: ', match );
              //   return !!match;
              // break;
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
      // Source: http://goessner.net/download/prj/jsonxml/
      parseXml: function ( xml ) {
        var dom = null;
        if ( window.DOMParser ) {
          try {
            dom = ( new DOMParser() ).parseFromString( xml, 'text/xml' );
          } catch ( e ) {
            dom = null;
          }
        } else if ( window.ActiveXObject ) {
          try {
            dom = new ActiveXObject( 'Microsoft.XMLDOM' );
            dom.async = false;

            if ( !dom.loadXML( xml ) ) { // parse error ..
              console.error( dom.parseError.reason + dom.parseError.srcText );
            }
          } catch ( e ) {
            dom = null;
          }
        } else {
          console.error( 'Cannot parse XML string.' );
        }

        return dom;
      },
      // https://gist.github.com/sstur/7379870
      DOMtoJSON: function ( node ) {
        node = ( node || this );
        var obj = {
          nodeType: node.nodeType
        };

        if ( node.tagName ) {
          obj.tagName = node.tagName.toLowerCase();
        } else if ( node.nodeName ) {
          obj.nodeName = node.nodeName;
        }

        if ( node.nodeValue ) {
          obj.nodeValue = node.nodeValue;
        }

        var attrs = node.attributes;
        if ( attrs ) {
          var length = attrs.length;
          var arr = obj.attributes = new Array( length );
          for ( var i = 0; i < length; i++ ) {
            var attr = attrs[i];
            arr[i] = [ attr.nodeName, attr.nodeValue ];
          }
        }

        var childNodes = node.childNodes;
        if ( childNodes ) {
          length = childNodes.length;
          arr = obj.childNodes = new Array( length );

          for ( i = 0; i < length; i++ ) {
            arr[i] = this.DOMtoJSON( childNodes[i] );
          }
        }

        return obj;
      }, //toJSON
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
