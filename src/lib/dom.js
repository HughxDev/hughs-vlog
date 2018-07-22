const range = document.createRange();

// const getOwnerDocument = () => {
//   if ( 'currentScript' in document ) {
//     return document.currentScript.ownerDocument;
//   }
//
//   if ( 'ownerDocument' in document ) {
//     return document.ownerDocument;
//   }
// };

const parseHTML = function parseHTML( string ) {
  return range.createContextualFragment( string );
};

export { parseHTML };

const attachShadowDOM = function attachShadowDOM( elementInstance, ElementClass, mode ) {
  mode = ( mode || "open" );
  const $shadowRoot = elementInstance.attachShadow( { "mode": mode } );
  const $shadowContent = parseHTML( ElementClass.template );

  $shadowRoot.appendChild( $shadowContent );
};

export { attachShadowDOM };

const XMLNS = {
  "xml": "http://www.w3.org/XML/1998/namespace",
  "xhtml": "http://www.w3.org/1999/xhtml",
  "hvml": "http://vocab.nospoon.tv/ovml#",
  "xlink": "http://www.w3.org/1999/xlink"
};

export { XMLNS };
