"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';
import HVMLAwareElement from '../../lib/hvml-aware-element.js';
import { XMLNS } from '../../lib/dom.js';

import /*HughsVlogFeedEntry from*/ './hughs-vlog-feed__entry.js';

let HughsVlogFeed = class HughsVlogFeed extends HTMLElement {
  static get is() {
    return 'hughs-vlog-feed';
  }

  static get template() {
    /*
      <script type="module" src="components/hughs-vlog-feed__entry.js"></script>
    */
    return `
      <template id="${HughsVlogFeed.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
            /*overflow: hidden;*/
          }

          /*:host {
            display: block;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          @media only screen and ( min-width: 48em ) {
            :host {
              margin: -.25rem;
            }
          }*/

          /*.hughs-vlog-feed-entry:first-of-type {
            width: 100%;
          }*/
        </style>
        <!--<h2>Episodes</h2>-->
        <slot></slot>
      </template>
    `;
  }

  static get observedAttributes() {
    return [ 'src', 'order', 'limit' ];
  }

  constructor() {
    super();

    this.hvml = null;
    this.hvmlImported = false;
    this.loading = false;
    this.src = this.getSrc();
    this.order = this.getOrder();
    this.limit = this.getLimit();
    this.delegated = this.hasAttribute( 'delegated' );
  } // constructor

  connectedCallback() {
    this.setAttribute( 'role', 'article' );

    if ( !this.delegated && !this.hvmlImported ) {
      this.importHvml();
    }
  }

  attributeChangedCallback( attribute, oldValue, newValue ) {
    // console.log( 'Attribute changed: ', attribute, oldValue, newValue );

    switch ( attribute ) {
      case 'src':
        this.src = this.getSrc( newValue );
        this.giveChildrenUpForAdoption();
        this.importHvml();
      break;

      case 'order':
        this.order = this.getOrder( newValue );
      break;

      case 'limit':
        this.limit = this.getLimit( newValue );
      break;
    }
  }

  getSrc( src ) {
    return ( src || this.getAttribute( 'src' ) );
  }

  getOrder( order ) {
    return ( order || this.getAttribute( 'order' ) || 'desc' ).toLowerCase();
  }

  getLimit( limit ) {
    return ( limit || this.getAttribute( 'limit' ) );
  }

  slotChanged( resolve, reject, event ) {
    const slot = event.currentTarget;
    const assignedNodes = slot.assignedNodes();
    const hvmlChild = this._getFirstHvmlChild( assignedNodes );

    if ( hvmlChild ) {
      // console.log( 'got slotted hvml' );
      this._loadHvmlFromElementNode( hvmlChild, resolve );
    // No src or composed children:
    }
    // else {
    //   reject( 'No src or composed children' );
    // }
  }

  _appendEntries( nodes ) {
    // console.log( '_appendEntries', nodes );

    var i;
    var entry;
    var node;

    while ( this.shadowRoot.firstChild ) {
      this.shadowRoot.removeChild( this.shadowRoot.firstChild );
    }

    switch ( this.order ) {
      case 'desc':
        for ( i = 0; i < nodes.length; i++ ) {
          node = nodes[i];

          if ( node ) {
            entry = document.createElement( 'hughs-vlog-feed__entry' );

            if ( this.hasAttribute( 'large' ) ) {
              entry.setAttribute( 'large', 'large' );
            }

            if ( this.hasAttribute( 'playable' ) ) {
              entry.setAttribute( 'playable', 'playable' );
            }

            entry.data = node;

            // if ( i === 0 ) {
              this.shadowRoot.appendChild( entry );
            // } else {
            //   this.$$( '#episodes' ).appendChild( entry );
            // }
          }
        }
      break; // case 'desc'

      case 'asc':
      /* falls through */
      default:
        for ( i = nodes.length - 1; i >= 0; i-- ) {
          node = nodes[i];

          if ( node ) {
            entry = document.createElement( 'hughs-vlog-feed__entry' );

            if ( this.hasAttribute( 'large' ) ) {
              entry.setAttribute( 'large', 'large' );
            }

            if ( this.hasAttribute( 'playable' ) ) {
              entry.setAttribute( 'playable', 'playable' );
            }

            entry.data = node;

            this.shadowRoot.appendChild( entry );
          }
        }
      break; // case 'asc', default
    } // switch
  } // _appendEntries

  isLoaded() {
    return ( !this.loading && ( this.hvml !== null ) );
  }
}

HughsVlogFeed = HVMLAwareElement( HughsVlogElement( HughsVlogFeed ) );

window.customElements.define( HughsVlogFeed.is, HughsVlogFeed );

export default HughsVlogFeed;
