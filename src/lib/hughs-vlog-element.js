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
      ShadyCSS.prepareTemplate( this.$template, superClass.is );
    }

    connectedCallback() {
      ShadyCSS.styleElement( this );
      if ( !this.shadowRoot ) {
        this.attachShadow( { "mode": "open" } );
        this.shadowRoot.appendChild(
          document.importNode( this.$template.content, true )
        );
      }
    }
  }
};

export default HughsVlogElement;
