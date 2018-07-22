"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlogEpisode extends HTMLElement {
  static get template() {
    return `
      <script type="module" src="components/hughs-vlog-feed.js"></script>
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
    `;
  }

  constructor() {
    super();
    attachShadowDOM( this, HughsVlogEpisode );

    this.$ = {};
    this.$$ = this.shadowRoot.querySelector.bind( this.shadowRoot );
    this.$$$ = this.shadowRoot.querySelectorAll.bind( this.shadowRoot );
  }

  connectedCallback() {
    this.$.feed = this.$$( '#feed' );

    if ( this.children.length ) {
      //
    } else {
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

      switch ( query ) {
        case 'latest':
          // this.$.feed.setAttribute( 'limit', '1' );
          feedSrc += '?limit=1';
        break;
      }

      this.$.feed.setAttribute( 'playable', 'playable' );
      this.$.feed.setAttribute( 'large', 'large' );
      this.$.feed.setAttribute( 'src', feedSrc );
    }
  }
}

window.customElements.define( 'hughs-vlog-episode', HughsVlogEpisode );
