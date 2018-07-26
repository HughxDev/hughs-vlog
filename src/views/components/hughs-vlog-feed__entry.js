"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';
import { parseHTML } from '../../lib/dom.js';

let HughsVlogFeedEntry = class HughsVlogFeedEntry extends HTMLElement {
  static get is() {
    return 'hughs-vlog-feed__entry';
  }

  static get template() {
    return `
      <template id="${HughsVlogFeedEntry.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: inline-block;
            /*display: inline-flex;*/
            /*width: 360px;*/
            width: 50%;
            position: relative;
          }

          :host([large]) {
            display: block;
            /*display: flex;*/
            /*width: 853px;*/
            width: 100%;
          }

          .hughs-vlog-feed-entry__player {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            max-width: 100%;
          }

          .hughs-vlog-feed-entry__player > iframe,
          .hughs-vlog-feed-entry__player > object,
          .hughs-vlog-feed-entry__player > embed,
          .hughs-vlog-feed-entry__player > img,
          .hughs-vlog-feed-entry__player > svg {
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

          .h {
            margin: 0 auto;
            line-height: 1.75;
          }

          .title {
            line-height: 1.25;
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
        </style>

        <header>
          <hgroup data-layout="standalone">
            <h3 class="h h--3"><time id="recorded"></time>:</h3>
            <h2 id="title" class="h h--2 title"></h2>
          </hgroup>
          <a data-layout="list" class="flex-container" href="javascript:void(0);">
            <hgroup class="flex-item">
              <h3 class="h h--3"><time id="recorded"></time>:</h3>
              <h2 id="title" class="h h--2 title"></h2>
            </hgroup>
          </a>
          <dl data-layout="standalone">
            <dt>Published</dt>
            <dd><time id="published"></time></dd>
          </dl>
        </header>
        <!-- <h2></h2> -->
        <div id="player" class="hughs-vlog-feed-entry__player">
          <img src="http://via.placeholder.com/640x360" />
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
    this.$ = {};

    this.setAttribute( 'id', ( this.data.getAttributeNS( 'xml', 'id' ) || this.data.getAttribute( 'xml:id' ) ) );
    this.setAttribute( 'role', 'article' );
    this.setAttribute( 'class', 'hughs-vlog-feed-entry' );

    this.$$ = this.shadowRoot.querySelector.bind( this.shadowRoot );
    this.$$$ = this.shadowRoot.querySelectorAll.bind( this.shadowRoot );

    console.log( 'this', [this] );

    if ( this.parentNode && this.parentNode.host ) {
      if ( this.parentNode.host.hasAttribute( 'limit' ) ) {
        this.limit = parseInt( this.parentNode.host.getAttribute( 'limit' ), 10 );
      }
    }

    this.render();
  }

  select( xpath, data ) {
    data = ( data || this.data );

    if ( this.parentNode && this.parentNode.host ) {
      try {
        return this.parentNode.host.select( xpath, data );
      } catch ( error ) {
        console.info( error );
        return false;
      }
    }

    // @todo: throw?
    return false;
  }

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

      return months[ parseInt( number, 10 ) ];
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
      this.$$( '#title' ).textContent = this.getText( this.select( 'hvml:title' ) );
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

  getOembed( url ) {
    const endpoint = 'http://localhost:3000/oembed?url=' + encodeURIComponent( url );
    const oembedPromise = ( resolve, reject ) => {
      const xhr = new XMLHttpRequest();
      let oembedJSON;

      xhr.open( 'GET', endpoint, true );
      xhr.setRequestHeader( 'Accept', 'application/xml;q=0.8,text/xml;q=0.6,application/json;q=0.4' );

      xhr.onload = ( /*event*/ ) => {
        switch ( xhr.status ) {
          case 200:
            oembedJSON = JSON.parse( ( xhr.responseXML || xhr.responseText ) );

            oembedJSON.html = oembedJSON.html.replace( 'allowfullscreen', 'allowfullscreen="allowfullscreen"' ).replace( 'iframe', 'iframe xmlns="http://www.w3.org/1999/xhtml"' );

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

HughsVlogFeedEntry = HughsVlogElement( HughsVlogFeedEntry );

window.customElements.define( HughsVlogFeedEntry.is, HughsVlogFeedEntry );

export default HughsVlogFeedEntry;
