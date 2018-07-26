// const getOwnerDocument = () => {
//   if ( 'currentScript' in document ) {
//     return document.currentScript.ownerDocument;
//   }
//
//   if ( 'ownerDocument' in document ) {
//     return document.ownerDocument;
//   }
// };

const range = document.createRange();
const parseHTML = function parseHTML( string ) {
  return range.createContextualFragment( string );
};

export { parseHTML };

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
