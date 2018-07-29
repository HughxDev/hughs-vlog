"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

import HughsVlogFeed from './hughs-vlog-feed.js';

class HughsVlogEpisode extends HTMLElement {
  static get is() {
    return 'hughs-vlog-episode';
  }

  static get template() {
    /*
      <script type="module" src="components/hughs-vlog-feed.js"></script>
    */
    return `
      <template id="${HughsVlogEpisode.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
          }
        </style>
        <hughs-vlog-feed id="feed">
          <slot></slot>
        </hughs-vlog-feed>
      </template>
    `;
  }

  connectedCallback() {
    this.$.feed = this.$$( '#feed' );
    this.$.feed.setAttribute( 'playable', 'playable' );
    this.$.feed.setAttribute( 'large', 'large' );

    const hvmlChild = this.$.feed._getFirstHvmlChild( this.children );

    if ( !hvmlChild ) {
      var feedSrc = 'http://localhost:3000/videos';

      // @number, @published, @recorded
      var query = null;
      var whichAttribute = null;

      if ( this.hasAttribute( 'published') ) {
        whichAttribute = 'published';
        query = this.getAttribute( whichAttribute );

        if ( query !== 'latest' ) {
          feedSrc += '/search?published=' + query;
        }
      } else if ( this.hasAttribute( 'number' ) ) {
        whichAttribute = 'number';
        query = this.getAttribute( whichAttribute );
        feedSrc += '/search?number=' + query;
      } else if ( this.hasAttribute( 'recorded' ) ) {
        whichAttribute = 'recorded';
        query = this.getAttribute( whichAttribute );
        feedSrc += '/search?recorded=' + query;
      }

      if ( typeof query === 'string' ) {
        query = query.toLowerCase().trim();
      }

      // switch ( query ) {
      //   case 'latest':
      this.$.feed.setAttribute( 'limit', '1' );
      feedSrc += '?limit=1';
        // break;
      // }

      // this.$.feed.setAttribute( 'playable', 'playable' );
      // this.$.feed.setAttribute( 'large', 'large' );
      this.$.feed.setAttribute( 'src', feedSrc );
    }
  }
}

HughsVlogEpisode = HughsVlogElement( HughsVlogEpisode );

window.customElements.define( HughsVlogEpisode.is, HughsVlogEpisode );

export default HughsVlogEpisode;
