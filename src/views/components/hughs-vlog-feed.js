"use strict";
import HughsVlogElement from '/lib/hughs-vlog-element.js';
import { XMLNS } from '/lib/dom.js';

import '/components/hughs-vlog-feed__entry.js';

class HughsVlogFeed extends HTMLElement {
  static get is() {
    return 'hughs-vlog-feed';
  }

  static get template() {
    return `
      <template id="${HughsVlogFeed.is}">
        <!-- <script type="module" src="components/hughs-vlog-feed__entry.js"></script> -->
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
          }

          .hughs-vlog-feed-entry:first-of-type {
            width: 100%;
          }
        </style>
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
    console.log( 'connectedCallback' );
    if ( !this.hvmlImported ) {
      this.importHvml();
    }
  }

  attributeChangedCallback( attribute, oldValue, newValue ) {
    console.log( 'Attribute changed: ', attribute, oldValue, newValue );

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
      break;
    }

    return false;
  }

  giveChildrenUpForAdoption() {
    // console.log( 'this.lastChild', this.lastChild );
    if ( this.shadowRoot.children.length ) {
      console.log( 'Removing applicable children: ', this.shadowRoot.children );

      var children = this.shadowRoot.children;

      // for (let item of list)
      for ( let i = 0; i < children.length; i++ ) {
        let child = children[i];
        let nodeName = child.nodeName.toLowerCase();

        if ( !this._isTemplateChild( nodeName ) ) {
          console.log( `Removing ${nodeName}`, child )
          this.shadowRoot.removeChild( child );
        } else {
          console.log( `Skipping ${nodeName}`, child );
        }
      }
    } else {
      console.log( 'has no children' );
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
    console.log( 'event', event );
    console.log( 'resolve', resolve );
    console.log( 'reject', reject );

    const slot = event.currentTarget;
    const assignedNodes = slot.assignedNodes();
    // console.log( 'assignedNodes', assignedNodes );
    const hvmlChild = _getFirstHvmlChild( assignedNodes );

    if ( hvmlChild ) {
      console.log( 'got slotted hvml' );
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
      console.log( 'tempHvml has attributes' );
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
    console.log( 'Resolving HVML' );
    console.log( 'resolve', resolve );
    console.log( 'reject', reject );

    if ( !this.isLoaded() ) {
      console.log( 'HVML not yet loaded' );

      if ( this.hasOwnProperty( 'src' ) && this.src ) {
        console.log( 'Feed has src attribute' );

        // console.log( 'has feed src' );
        // console.log( 'this.src', this.src );
        // console.log( 'a' );
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
        console.log( 'Feed has no src, check for slotted hvml child', this.shadowRoot );

        var slot = this.querySelector( 'slot' );

        if ( slot ) {
          console.log( 'feed has slot; loading HVML if possible right now and setting up event listener' );

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
      console.log( 'HVML is alread loaded' );
      resolve( this.hvml );
    }
    // return this.hvml;
  }

  importHvml() {
    console.log( 'importHvml was called' );

    // this.hvmlImported = ( this.hvmlImported || new Promise( this._resolveHvml.bind( this ) ) );
    this.hvmlImported = ( new Promise( this._resolveHvml.bind( this ) ) );
    console.log( 'this.hvmlImported', this.hvmlImported );
    this.hvmlImported
      .then( ( response ) => {
        console.log( 'HVML has been imported; selecting hvml:video elements from: ', response );
        console.log( 'this.hvml', this.hvml );
        let nodes = this.select( '//hvml:video', response );

        console.log( 'nodes from first then', nodes );

        return nodes;
      } )
      .then( this._appendEntries.bind( this ) )
      .catch( ( error ) => {
        console.warn( 'HVML Import failed: ', error );
        delete this.hvmlImported;
      } )
    ;
  }

  _appendEntries( nodes ) {
    console.log( '_appendEntries', nodes );

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

            this.shadowRoot.appendChild( entry );
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

  select( xpath, refNode, xpathType ) {
    // var feed = this;
    // console.log( 'this', [this] );
    var evaluator = new XPathEvaluator();
    // var promise = this.hvmlImported.then(function ( response ) {
      if ( !xpath ) {
        throw 'No XPath provided';
      }

      if ( !refNode ) {
        throw 'No reference node provided';
      }

      // console.log( 'refNode', [refNode] );
      // console.log( 'refNode.documentElement.namespaceURI', refNode.documentElement.namespaceURI );

      switch ( refNode.nodeType ) {
        case Node.ELEMENT_NODE: // 1
          // console.log( 'Element node' );
        break;

        case Node.TEXT_NODE: // 3
        case Node.PROCESSING_INSTRUCTION_NODE: // 7
        case Node.COMMENT_NODE: // 8
        break;

        case Node.DOCUMENT_NODE: // 9
          // console.log( 'Document node' );
        break;

        case Node.DOCUMENT_TYPE_NODE: // 10
        case Node.DOCUMENT_FRAGMENT_NODE: // 11
        break;
      }
      // if ( refNode )

      var result;
      var nodes = [];
      var node;
      var i = 0;
      var snapshotLength;
      // response === this.hvml
      var defaultNS;

      // Automatic Namespace Resolution:
      // XMLNSResolver = this.evaluator.createNSResolver( this.hvml.documentElement );

      // Custom Namespace Resolution:
      console.log( 'refNode', refNode );
      // hasAttribute
      if ( ( 'hasAttribute' in refNode ) && refNode.hasAttribute( 'xmlns' ) ) {
        defaultNS = refNode.getAttribute( 'xmlns' );
        console.log('getAttribute')
      } else if ( ( 'documentElement' in refNode ) && refNode.documentElement.hasAttribute( 'xmlns' ) ) {
        defaultNS = refNode.documentElement.getAttribute( 'xmlns' );
        console.log('documentElement');
      } else {
        // defaultNS = XMLNS.hvml;
        defaultNS = XMLNS.xhtml;
        console.log( 'fallback' );
      }

      console.log( 'defaultNS', defaultNS );

      function nsResolver( prefix ) {
        return ( XMLNS[prefix] || defaultNS );
        // return XMLNS.xhtml;
      }

      // xpathType = xpathType ||  XPathResult.ORDERED_NODE_ITERATOR_TYPE;
      // Better performance (https://www.nczonline.net/blog/2009/03/17/xpath-in-javascript-part-1/)
      xpathType = xpathType || XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;

      result = evaluator.evaluate(
        xpath,
        // '//xhtml:hvml',
        refNode,
        nsResolver,
        // XMLNS.xhtml,
        // null,
        xpathType,
        null
      );

      console.log( 'result', result );

      if ( result ) {
        switch ( xpathType ) {
          case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
            // console.log( 'ordered node iterator' );
            node = result.iterateNext();

            nodes.push( node );

            while( node ) {
              node = result.iterateNext();
              nodes.push( node );
            }
          break;

          case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
            let snapshotLength = result.snapshotLength;
            // console.log( 'ordered node snapshot' );

            // console.log( 'result.snapshotLength', result.snapshotLength );
            if ( !snapshotLength ) {
              throw `XPath expression \`${xpath}\` didn’t match any nodes in ${refNode.nodeName.toLowerCase()}`;
            }

            for ( ; i < snapshotLength; ++i ) {
              // console.log( 'result.snapshotItem(i)', result.snapshotItem(i) );
              nodes.push( result.snapshotItem(i) );
            }
          break;

          default:
            // console.log( 'default' );
        }
      } else {
        console.log( 'Falsey result: ', result );
      }

      // console.log( 'nodes', nodes );
      // resolve( result );
      return nodes;
    // } );

    // return promise;
  };

  isLoaded() {
    return ( !this.loading && ( this.hvml !== null ) );
  }
}

HughsVlogFeed = HughsVlogElement( HughsVlogFeed );

window.customElements.define( HughsVlogFeed.is, HughsVlogFeed );

export default HughsVlogFeed;
