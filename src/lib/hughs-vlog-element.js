import { parseHTML } from '/lib/dom.js';

const HughsVlogElement = ( superClass ) => {
  return class extends superClass {
    constructor() {
      super();
      // attachShadowDOM( elementInstance, ElementClass, mode )
      this.$template = parseHTML( superClass.template ).children[superClass.is];
      // console.log( 'superClass.is', superClass.is );
      // console.log( 'superClass.template', superClass.template );
      // console.log( 'this.$template', this.$template );
      if ( window.hasOwnProperty( 'ShadyCSS' ) ) {
        ShadyCSS.prepareTemplate( this.$template, superClass.is );
      }
    }

    connectedCallback() {
      if ( window.hasOwnProperty( 'ShadyCSS' ) ) {
        ShadyCSS.styleElement( this );
      }

      if ( !this.shadowRoot ) {
        this.attachShadow( { "mode": "open" } );
        this.shadowRoot.appendChild(
          document.importNode( this.$template.content, true )
        );
      }

      // This will fail if a custom element lacks a connectedCallback.
      // Unfortunately there doesn’t seem to be a way to test for the
      // presence of it. So all custom elements should include a
      // connectedCallback definition even if it’s empty.
      super.connectedCallback();
    }
  }
};

export default HughsVlogElement;
