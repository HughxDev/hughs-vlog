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
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          @media only screen and ( min-width: 48em ) {
            :host {
              margin: -.25rem;
            }
          }

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
  } // constructor

  connectedCallback() {
    this.setAttribute( 'role', 'article' );

    if ( !this.hvmlImported ) {
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

  _isTemplateChild( nodeName ) {
    switch ( nodeName ) {
      case '#text':
      case 'slot':
      case 'style':
      case 'script':
        return true;
      // break;
    }

    return false;
  }

  giveChildrenUpForAdoption() {
    if ( this.shadowRoot && this.shadowRoot.children && this.shadowRoot.children.length ) {
      // console.log( 'Removing applicable children: ', this.shadowRoot.children );

      var children = this.shadowRoot.children;

      // for (let item of list)
      for ( let i = 0; i < children.length; i++ ) {
        let child = children[i];
        let nodeName = child.nodeName.toLowerCase();

        if ( !this._isTemplateChild( nodeName ) /*&& ( nodeName !== 'h2' )*/ ) {
          // console.log( `Removing ${nodeName}`, child )
          this.shadowRoot.removeChild( child );
        } else {
          // console.log( `Skipping ${nodeName}`, child );
        }
      }
    } else {
      // console.log( 'has no children' );
    }
  }

  _getFirstHvmlChild( children ) {
    // @todo: Deal with hvml not being the first child
    if ( children.length ) {
      for ( let i = 0; i < children.length; i++ ) {
        if ( children[i].nodeName.toLowerCase() === 'hvml' ) {
          return children[i];
        }
      }
    }

    return false;
  }

  _containsHvml( children ) {
    return !!this._getFirstHvmlChild( children );
  }

  _slotContainsHvml( slot ) {
    // @todo: Check if input is actually a slot.
    // Deferred for now because it’s usually redundant.
    // if ( slot && ( slot.nodeName.toLowerCase() === 'slot' ) ) {
    const assignedNodes = slot.assignedNodes();
    return this._containsHvml( assignedNodes );
    // }
    // return false;
  }

  _loadHvmlFrom( hvml, resolve ) {
    this.hvml = this._documentifyHvml( hvml );
    this.loading = false;
    resolve( this.hvml );
  }

  slotChanged( resolve, reject, event ) {
    const slot = event.currentTarget;
    const assignedNodes = slot.assignedNodes();
    const hvmlChild = this._getFirstHvmlChild( assignedNodes );

    if ( hvmlChild ) {
      // console.log( 'got slotted hvml' );
      this._loadHvmlFrom( hvmlChild, resolve );
    // No src or composed children:
    }
    // else {
    //   reject( 'No src or composed children' );
    // }
  }

  // Plain node trees can’t be queried with XPath,
  // so we have to turn them into a legitimate Document object.
  _documentifyHvml( tempHvml ) {
    // Hack for edge case where a slotted <hvml> has no @xmlns:
    if ( tempHvml.namespaceURI === XMLNS.xhtml ) {
      console.log( '<hvml> is in the XHTML namespace; hvml: will be aliased' );
      XMLNS.hvml = XMLNS.xhtml;
    }

    // Document nodes are not allowed as children of Element nodes,
    // so this should always be true and we can skip checking it
    // if ( tempHvml.nodeType !== Node.DOCUMENT_NODE ) {
    var doc = document.implementation.createDocument( ( tempHvml.namespaceURI || XMLNS.hvml ), 'hvml', null );

    if ( tempHvml.hasAttributes() ) {
      // console.log( 'tempHvml has attributes' );
      let attributes = tempHvml.attributes;
      for ( let i = attributes.length - 1; i >= 0; --i ) {
        doc.documentElement.setAttribute( attributes[i].name, attributes[i].value );
      }
    }

    doc.documentElement.appendChild(
      tempHvml.children[0]
        // - Using cloneNode allows us to retain the light DOM.
        // - Omitting cloneNode will remove the HVML children from
        //   the light DOM and append them to the invisible this.hvml.
        //   If the light DOM was updated, this.hvml would have to be kept
        //   in-sync, and vice-versa.
        .cloneNode( true )
    );

    return doc;
  }

  _resolveHvml( resolve, reject ) {
    // console.log( 'Resolving HVML' );

    if ( !this.isLoaded() ) {
      // console.log( 'HVML not yet loaded' );

      if ( this.hasOwnProperty( 'src' ) && this.src ) {
        // console.log( 'Feed has src attribute' );

        // console.log( 'has feed src' );
        // console.log( 'this.src', this.src );
        var xhr = new XMLHttpRequest();

        xhr.open( 'GET', this.src, true );
        xhr.setRequestHeader( 'Accept', 'application/hvml+xml;q=0.8,application/xml;q=0.6,text/xml;q=0.4' );

        xhr.onload = ( event ) => {
          switch ( xhr.status ) {
            case 200:
              this.hvml = xhr.responseXML;
              this.loading = false;
              resolve( this.hvml );
            break;

            default:
              this.loading = false;
              reject( Error( xhr.statusText ) );
          }
        };

        xhr.onerror = ( event ) => {
          this.loading = false;
          reject( Error( 'There was a network error.' ) );
        };

        xhr.send( '' );
      // No src, check for slotted hvml child
      } else {
        // console.log( 'Feed has no src, check for slotted hvml child', this.shadowRoot );

        var slot = this.querySelector( 'slot' );

        if ( slot ) {
          // console.log( 'feed has slot; loading HVML if possible right now and setting up event listener' );

          let hvmlChild = this._getFirstHvmlChild( slot.assignedNodes() );

          if ( hvmlChild ) {
            this._loadHvmlFrom( hvmlChild, resolve );
          }

          // Avoid race conditions:
          slot.addEventListener( 'slotchange', this.slotChanged.bind( this, resolve, reject ) );
        // No src or slotted hvml; test for direct children (e.g. in the case of the ShadyDOM polyfill)
        } else {
          let hvmlChild = this._getFirstHvmlChild( this.children );
          if ( hvmlChild ) {
            this.hvml = this._documentifyHvml( hvmlChild );
            this.loading = false;
            resolve( this.hvml );
          // No light DOM hvml children
          } else {
            let hvmlChild = this._getFirstHvmlChild( this.shadowRoot.children );
            if ( hvmlChild ) {
              this.hvml = this._documentifyHvml( hvmlChild );
              this.loading = false;
              resolve( this.hvml );
            // No shadow DOM hvml children
            } else {
              reject( 'No src, nor hvml children (slotted, direct, or shadow)' );
            }
          }
        } // if slot
      }
    // !this.isLoaded()
    } else {
      // console.log( 'HVML is alread loaded' );
      resolve( this.hvml );
    }
    // return this.hvml;
  }

  importHvml() {
    // console.log( 'importHvml was called' );

    // this.hvmlImported = ( this.hvmlImported || new Promise( this._resolveHvml.bind( this ) ) );
    this.hvmlImported = ( new Promise( this._resolveHvml.bind( this ) ) );
    this.hvmlImported
      .then( ( response ) => {
        // console.log( 'HVML has been imported; selecting hvml:video elements from: ', response );
        let nodes = this.select( '//hvml:video', response );
        return nodes;
      } )
      .then( this._appendEntries.bind( this ) )
      .then( () => {
        this.setAttribute( 'loaded', 'loaded' );
      } )
      .catch( ( error ) => {
        console.warn( 'HVML Import failed: ', error );
        delete this.hvmlImported;
      } )
    ;
  }

  _appendEntries( nodes ) {
    // console.log( '_appendEntries', nodes );

    var i;
    var entry;
    var node;

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
