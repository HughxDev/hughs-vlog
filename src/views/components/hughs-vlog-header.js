"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

import /*HughsVlogSiteNav from*/ './hughs-vlog-site-nav.js';
import /*HughsVlogSubscribe from*/ './hughs-vlog-subscribe.js';

let HughsVlogHeader = class HughsVlogHeader extends HTMLElement {
  static get is() {
    return 'hughs-vlog-header';
  }

  static get template() {
    /*
      <script type="module" src="components/hughs-vlog-site-nav.js"></script>
      <script type="module" src="components/hughs-vlog-subscribe.js"></script>
    */
    return `
      <template id="${HughsVlogHeader.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
            text-align: center;
            margin: 1.5rem auto 2.5rem;
          }

          ::slotted(a) {
            text-decoration: none;
            color: inherit;
          }

          /*
            ::slotted(a:hover),
            ::slotted(a:focus) {
              text-decoration: underline;
            }
          */

          ::slotted(.h) {
            margin: 0 auto;
          }

          ::slotted(p) {
            margin: .5rem auto 1rem;
          }

          ::slotted(.link-wrapper) {
            display: block;
          }
        </style>
        <slot></slot>
      </template>
    `;
  }

  // constructor() {
  //   super();
  // }

  connectedCallback() {
    this.setAttribute( 'role', 'banner' );
  }
}

HughsVlogHeader = HughsVlogElement( HughsVlogHeader );

window.customElements.define( HughsVlogHeader.is, HughsVlogHeader );

export default HughsVlogHeader;
