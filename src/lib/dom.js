// const getOwnerDocument = () => {
//   if ( 'currentScript' in document ) {
//     return document.currentScript.ownerDocument;
//   }
//
//   if ( 'ownerDocument' in document ) {
//     return document.ownerDocument;
//   }
// };

// @todo: this can be adapted to handle XML
const range = document.createRange();
const parseHTML = function parseHTML( string ) {
  return range.createContextualFragment( string );
};

export { parseHTML };

// http://goessner.net/download/prj/jsonxml/
const legacyParseXML = function parseXML( xml ) {
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
};

export { legacyParseXML };

// prepareTemplate(templateElement, elementName, elementExtension){},
// ShadyCSS.prepareTemplate(myElementTemplate, 'my-element');
//   class MyElement extends HTMLElement {
//     connectedCallback() {
//       ShadyCSS.styleElement(this);
//       if (!this.shadowRoot) {
//         this.attachShadow({mode: 'open'});
//         this.shadowRoot.appendChild(
//           document.importNode(myElementTemplate.content, true));
//       }
//     }
//   }

const attachShadowDOM = function attachShadowDOM(
  elementInstance,
  ElementClass,
  mode
) {
  mode = ( mode || "open" );
  const $shadowRoot = elementInstance.attachShadow( { "mode": mode } );
  const $template = parseHTML( ElementClass.template );

  window.ShadyCSS.prepareTemplate( $template, ElementClass.is );
  // $shadowRoot.appendChild( $shadowContent );
  $shadowRoot.appendChild(
    document.importNode( $template.content, true )
  );
};

export { attachShadowDOM };

const XMLNS = {
  "xml": "http://www.w3.org/XML/1998/namespace",
  "xhtml": "http://www.w3.org/1999/xhtml",
  "hvml": "http://vocab.nospoon.tv/ovml#",
  "xlink": "http://www.w3.org/1999/xlink"
};

export { XMLNS };

// https://gist.github.com/sstur/7379870
const DOMtoJSON = function DOMtoJSON( node ) {
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
}; // DOMtoJSON

export { DOMtoJSON };

// https://gist.github.com/sstur/7379870
const JSONtoDOM = function JSONtoDOM( obj ) {
  if ( typeof obj === 'string' ) {
    obj = JSON.parse( obj );
  }

  var node, nodeType = obj.nodeType;

  switch ( nodeType ) {
    case 1: //ELEMENT_NODE
      node = document.createElement( obj.tagName );
      var attributes = obj.attributes || [];

      for ( var i = 0, len = attributes.length; i < len; i++ ) {
        var attr = attributes[i];
        node.setAttribute( attr[0], attr[1] );
      }
    break;

    case 3: //TEXT_NODE
      node = document.createTextNode( obj.nodeValue );
    break;

    case 8: //COMMENT_NODE
      node = document.createComment( obj.nodeValue );
    break;

    case 9: //DOCUMENT_NODE
      node = document.implementation.createDocument();
    break;

    case 10: //DOCUMENT_TYPE_NODE
      node = document.implementation.createDocumentType( obj.nodeName );
    break;

    case 11: //DOCUMENT_FRAGMENT_NODE
      node = document.createDocumentFragment();
    break;

    default:
      return node;
  }

  if ( nodeType == 1 || nodeType == 11 ) {
    var childNodes = obj.childNodes || [];
    for ( i = 0, len = childNodes.length; i < len; i++ ) {
      node.appendChild( this.JSONtoDOM( childNodes[i] ) );
    }
  }

  return node;
}; // JSONtoDOM

export { JSONtoDOM };

const Srcset = class HughsVlogSrcset {
  constructor( posters ) {
    this._srcset = this.toObject( posters );
    this._srcsetString = null;
  }

  /*
    `excludedHeights` is necessary because:
      • The YouTube API returns some
        thumbnail heights with letterboxing and some without, which screws up
        aspect ratios. While we could unsqueeze the thumbnails with heights >100%
        in CSS, we would have to check which thumbnail is currently being rendered,
        defeating the point of the browser handling srcset for us.
      • Vimeo gives us some of the same widths as YouTube, and duplicate entries
        for the same srcset descriptor is illegal in HTML.
    Alternatively, these images could be dynamically cropped.
  */
  toObject(
    posters,
    minimumWidth = 0,
    minimumHeight = 0,
    excludedHeights = {
      "youtube": [ 90, 360, 480, 1080 ],
      "vimeo": [ 75, 150, 720, 1080 ]
    },
    excludedFormats = [ "webp", "png" ]
  ) {
    // Caching: If the posters parameter is missing, and we already have a
    // saved srcset property from running the constructor, return early
    if ( !posters && this._srcset && ( this._srcset.length > 0 ) ) {
      return this._srcset;
    }

    posters = posters
      .filter( function ( src ) {
        let isYouTubePoster = !!src['xlink:href'].match( /^https?:\/\/i\.ytimg\.com/i );
        let isVimeoPoster = !!src['xlink:href'].match( /^https?:\/\/i\.vimeocdn\.com/i );
        let meetsMinimumDimensions = ( ( src.width >= minimumWidth ) && ( src.height >= minimumHeight ) );

        let hasExcludedYouTubeHeight = (
          isYouTubePoster
          && excludedHeights.youtube
          && ( excludedHeights.youtube.length > 0 )
          && ( excludedHeights.youtube.indexOf( src.height ) !== -1 )
        );

        let hasExcludedVimeoHeight = (
          isVimeoPoster
          && excludedHeights.vimeo
          && ( excludedHeights.vimeo.length > 0 )
          && ( excludedHeights.vimeo.indexOf( src.height ) !== -1 )
        );

        let isExcludedFormat = excludedFormats.reduce( function ( accumulator, format ) {
          const thumbnailUrlRegex = new RegExp( `\.${format}(\\?[^=]+=[^=]+(&[^=]+=[^=]+)*)?$`, 'i' );
          const matches = !!src['xlink:href'].match( thumbnailUrlRegex );

          return ( accumulator || matches );
        }, false );

        let passesCriteria = ( !isExcludedFormat && !hasExcludedYouTubeHeight && !hasExcludedVimeoHeight && meetsMinimumDimensions );

        return passesCriteria;
      } )
      .map( function removeVimeoPaddingParameters( src ) {
        src['xlink:href'] = src['xlink:href'].replace( /[?&]{1}r=pad\b/, '' );
        return src;
      } )
    ;

    posters.sort( function sortSrcsetByWidthAscending( a, b ) {
      return a.width - b.width;
    } );

    return posters;
  } // toObject

  toString() {
    if ( !this._srcsetString ) {
      this._srcsetString = this._srcset.reduce( ( srcset, src, index ) => {
        srcset += `${src['xlink:href']} ${src.width}w`;

        if ( index !== ( this._srcset.length - 1 ) ) {
          srcset += ', ';
        }

        return srcset;
      }, '' );
    }

    return this._srcsetString;
  }
};

export { Srcset };
