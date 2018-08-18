"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';
import HVMLAwareElement from '../../lib/hvml-aware-element.js';
import { parseHTML, XMLNS, JSONtoDOM } from '../../lib/dom.js';

let HughsVlogFeedEntry = class HughsVlogFeedEntry extends HTMLElement {
  static get is() {
    return 'hughs-vlog-feed__entry';
  }

  static get template() {
    return `
      <template id="${HughsVlogFeedEntry.is}">
        <style>
          @namespace hvml url(${XMLNS.hvml});

          * {
            box-sizing: border-box;
          }

          /*:host {
            display: inline-block;
            /*display: inline-flex;*
            /*width: 360px;*
            position: relative;
            width: 100%;
            margin: .25rem 0;
            flex-basis: 100%;
          }*/

          /*@media only screen and ( min-width: 48em ) {
            :host {
              width: 50%;
              margin: .25rem;
              flex-basis: calc(50% - .5rem);
            }
          }*/

          /*:host([large]) {
            /*display: block;*
            /*display: flex;*
            /*width: 853px;*
            width: 100%;
            flex-basis: 100%;
          }*/

          .player {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
          }

          .player > iframe,
          .player > object,
          .player > embed,
          .player > img,
          .player > svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .flex-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
          }

          /*:host([playable]) .flex-container {
            position: static;
            display: block;
            height: initial;
            color: inherit;
          }*/

          header {
            text-align: center;
          }

          header > dl {
            margin-top: 0;
          }

          hgroup {
            line-height: 1;
          }

          .h.title {
            line-height: 1.25;
          }

          .h {
            margin-top: 0;
            margin-bottom: 0;
            line-height: 1.75;
          }

          .h.h--entry-time {
            font-size: 1.17rem;
          }

          .h.h--entry-title {
            font-size: 1.5rem;
          }

          a {
            text-decoration: none;
          }

          a:hover,
          a:active {
            text-decoration: underline;
          }

          .flex-item {
            /*width: 39em;*/
            max-width: 90%;
            margin-left: auto;
            margin-right: auto;
          }

          .play-video {
            pointer-events: none;
          }

          dl {
            text-align: center;
          }

          dt {
            font-weight: bold;
          }

          dd {
            margin-left: 0;
          }

          dt,
          dd {
            display: inline-block;
          }

          ::slotted(hvml|video) {
            display: none;
          }

          ::slotted(video[xmlns="${XMLNS.hvml}"]) {
            display: none;
          }

          :host,
          .player,
          .poster {
            border-radius: inherit;
          }

          .title,
          .recorded,
          .published {
            color: rgb(255,255,0);
            text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
          }
        </style>
        <slot id="hvml" name="hvml"></slot>
        <header>
          <hgroup data-layout="standalone">
            <h3 class="h h--entry-time recorded"><time id="recorded"></time>:</h3>
            <h2 id="title" class="h h--entry-title title"></h2>
          </hgroup>
          <a data-layout="list" class="flex-container play-video" href="javascript:void(0);">
            <hgroup class="flex-item">
              <h3 class="h h--entry-time recorded"><time id="recorded"></time>:</h3>
              <h2 id="title" class="h h--entry-title title"></h2>
            </hgroup>
          </a>
          <dl data-layout="standalone">
            <dt>Published</dt>
            <dd class="published"><time id="published"></time></dd>
          </dl>
        </header>
        <!-- <h2></h2> -->
        <div id="player" class="player">
          <img id="img" class="poster" src="http://via.placeholder.com/640x360" />
        </div>
      </template>
    `;
  }

  constructor() {
    super();

    this.oembed = null;
    this.limit = null;
  } // constructor

  connectedCallback() {
    this.setAttribute( 'role', 'article' );
    // this.setAttribute( 'class', 'hughs-vlog-feed-entry' );

    this.$.hvmlSlot = this.$id( 'hvml' );

    if ( 'data' in this ) {
      // console.log( '[prop] this.data', this.data );
      // console.log( '[prop] typeof this.data', typeof this.data );
    } else if ( this.hasAttribute( 'data' ) ) {
      this.data = JSONtoDOM( JSON.parse( this.getAttribute( 'data' ) ) );
      this.removeAttribute( 'data' );
      // console.log( 'this.data', this.data );
      // console.log( 'typeof this.data', typeof this.data );
    } else {
      let assignedNodes = this.$.hvmlSlot.assignedNodes();
      let hvmlChild = this._getFirstHvmlChild( assignedNodes );

      // console.log( 'assignedNodes', assignedNodes );
      // console.log( 'hvmlChild', hvmlChild );

      if ( hvmlChild ) {
        this.data = hvmlChild;
      } else {
        throw new Error( 'No data supplied to `hughs-vlog-feed__entry`' );
      }
    }

    this.setAttribute( 'id', ( this.data.getAttributeNS( 'http://www.w3.org/XML/1998/namespace', 'id' ) || this.data.getAttribute( 'xml:id' ) ) );

    if ( this.parentNode && this.parentNode.host ) {
      if ( this.parentNode.host.hasAttribute( 'limit' ) ) {
        this.limit = parseInt( this.parentNode.host.getAttribute( 'limit' ), 10 );
      }
    }

    this.render();
  }

  attributeChangedCallback( attribute, oldValue, newValue ) {
    switch ( attribute ) {
      case 'data':
        // this.data = newValue;
        // console.log( newValue );
        this.data = JSONtoDOM( JSON.parse( this.getAttribute( 'data' ) ) );
        this.removeAttribute( 'data' );
      break;
    }
  }

  // select( xpath, data ) {
  //   data = ( data || this.data );
  //
  //   console.log( 'xpath', xpath );
  //   console.log( 'data', data );
  //
  //   if ( this.parentNode && this.parentNode.shadowRoot && this.parentNode.shadowRoot.host ) {
  //     try {
  //       return this.parentNode.shadowRoot.host.select( xpath, data );
  //     } catch ( error ) {
  //       console.info( error );
  //       return false;
  //     }
  //   // possible race condition:
  //   } else {
  //     console.log( 'No parentNode?', [this.parentNode.shadowRoot.host] );
  //   }
  //
  //   // @todo: throw?
  //   return false;
  // }

  getText( response ) {
    if ( response.length && response[0] && ( 'textContent' in response[0] ) ) {
      return response[0].textContent;
    }

    // throw 'No text';
    return '';
  }

  // extractTitle( response ) {
  //   if ( response.length && response[0] && ( 'textContent' in response[0] ) ) {
  //     return response[0].textContent;
  //   } else {
  //     throw 'No title';
  //   }
  // }

  getTitle() {
    // @todo: async/await
  }

  setTitle() {
    this.$.title.textContent = this.getText( this.select( 'hvml:title' ) );
  }

  formatDate( date ) {
    // return ;
    function getMonthName( number ) {
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      return months[ parseInt( number, 10 ) - 1 ];
    }

    // https://stackoverflow.com/a/13627586/214325
    function getOrdinalSuffix( number ) {
      var i = number % 10;
      var j = number % 100;

      if ( i === 1 && j !== 11 ) {
        return "st";
      }

      if ( i === 2 && j !== 12 ) {
        return "nd";
      }

      if ( i === 3 && j !== 13 ) {
        return "rd";
      }

      return "th";
    }

    var dateParts = date.split( 'T' )[0].split( '-' );
    var year = dateParts[0];
    var monthNumber = dateParts[1];
    var day = parseInt( dateParts[2], 10 );
    var month = getMonthName( monthNumber );
    var formatted = month + ' ' + day.toString() + getOrdinalSuffix( day ) + ', ' + year;

    return formatted;
  }

  selectPublished() {
    // return this.select( 'hvml:published' ).then( this.getText );
    return this.getText( this.select( 'hvml:published' ) );
  }

  renderPublished() {
    if ( !this.$.published ) {
      return;
    }

    const published = this.selectPublished();
    const publishedFormatted = this.formatDate( published );

    this.$.published.setAttribute( 'datetime', published );
    this.$.published.textContent = publishedFormatted;

    return published;
  }

  renderRecorded() {
    if ( !this.$.recorded ) {
      return;
    }

    const recorded = this.getText( this.select( 'hvml:recorded' ) );

    if ( recorded ) {
      let recordedFormatted = this.formatDate( recorded );

      this.$.recorded.setAttribute( 'datetime', recorded );
      this.$.recorded.textContent = recordedFormatted;
    }

    return recorded;
  }

  renderThumbnailOrPlayer() {
    const playable = ( this.parentNode && this.parentNode.host && this.parentNode.host.hasAttribute( 'playable' ) );

    if ( playable ) {
      this.getOembed( this.getYouTubeLink() ).then( ( oembed ) => {
        let parsedHTML = parseHTML( oembed.html );
        let embed = parsedHTML.querySelector( 'iframe' );

        this.$$( '#player' ).appendChild( embed );
        this.setTitle();
      } );
    } else {
      try {
        this.$id( 'img' ).setAttribute( 'src', this.select( 'hvml:presentation/hvml:poster' )[0].getAttribute( 'xlink:href') );
      } catch (e) {
        console.error( e );
      }

      this.$id( 'title' ).textContent = this.getText( this.select( 'hvml:title' ) );
    }
  }

  renderDates() {
    this.renderPublished();
    this.renderRecorded();
  }

  _cacheUI() {
    this.$.title = this.$$( '#title' );
    this.$.recorded = this.$$( '#recorded' );
    this.$.published = this.$$( '#published' );
  }

  chooseLayout() {
    var element;

    var standaloneLayoutElements = this.$$$( '[data-layout="standalone"]' );
    var listLayoutElements = this.$$$( '[data-layout="list"]' );
    var entryIsStandalone = this.isStandalone();

    for ( element of standaloneLayoutElements ) {
      if ( entryIsStandalone ) {
        element.hidden = false;
      } else {
        element.remove();
      }
    }

    for ( element of listLayoutElements ) {
      if ( entryIsStandalone ) {
        element.remove();
      } else {
        element.hidden = false;
      }
    }

    this._cacheUI();
  }

  render() {
    this.chooseLayout();
    this.renderThumbnailOrPlayer();
    this.renderDates();
  }

  getYouTubeLink() {
    const xpath = 'hvml:showing[@type="internet"][@admission="public"]//hvml:uri[starts-with(normalize-space(.), "https://www.youtube.com")][1]/text()';
    const youTubeLinks = this.select( xpath, this.data );

    if ( youTubeLinks.length && youTubeLinks[0] && ( 'textContent' in youTubeLinks[0] ) ) {
      return youTubeLinks[0].textContent;
    }

    // throw 'No YouTube Link Found';
    return null;
  }

  getDocumentLanguage() {
    const html = document.documentElement;
    return ( html.getAttributeNS( 'http://www.w3.org/XML/1998/namespace', 'lang' ) || html.getAttribute( 'xml:lang' ) || html.getAttribute( 'lang' ) );
  }

  getOembed( url ) {
    // const endpoint = 'http://localhost:3000/oembed?url=' + encodeURIComponent( url );
    const endpoint = process.env.VUE_APP_ROOT_API + '/oembed?url=' + encodeURIComponent( url );
    const oembedPromise = ( resolve, reject ) => {
      const xhr = new XMLHttpRequest();
      let oembedJSON;

      xhr.open( 'GET', endpoint, true );
      xhr.setRequestHeader( 'Accept', 'application/xml;q=0.8,text/xml;q=0.6,application/json;q=0.4' );

      xhr.onload = ( /*event*/ ) => {
        switch ( xhr.status ) {
          case 200:
            oembedJSON = JSON.parse( ( xhr.responseXML || xhr.responseText ) );

            oembedJSON.html = oembedJSON.html
              .replace( 'allowfullscreen', 'allowfullscreen="allowfullscreen"' )
              .replace( 'iframe', 'iframe xmlns="http://www.w3.org/1999/xhtml"' )
              .replace(
                /(\/\/www.youtube.com\/embed\/[^\/]+\?feature=oembed)/,
                `$1&modestbranding=1&showinfo=0&enablejsapi=1&rel=0&hl=${this.getDocumentLanguage()}`
              ) // &controls=0, &autohide=1 (deprecated)
            ;

            // oembedJSON.html = oembedJSON.html.replace( /src="[^"]+"/, 'src="blah.html"' );

            this.oembed = oembedJSON;

            resolve( this.oembed );
          break;

          default:
            reject( Error( xhr.statusText ) );
        }
      };

      xhr.onerror = ( /*event*/ ) => {
        reject( Error( 'There was a network error.' ) );
      };

      xhr.send( '' );
    };

    return new Promise( oembedPromise );
  }

  isStandalone() {
    return ( this.limit === 1 );
  }

  isPartOfList() {
    // return ( !this.limit || ( this.limit > 1 ) );
    return !this.isStandalone();
  }
}

HughsVlogFeedEntry = HVMLAwareElement( HughsVlogElement( HughsVlogFeedEntry ) );

window.customElements.define( HughsVlogFeedEntry.is, HughsVlogFeedEntry );

export default HughsVlogFeedEntry;
