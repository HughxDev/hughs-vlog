"use strict";
import HughsVlogElement from '/lib/hughs-vlog-element.js';

class HughsVlogFooter extends HTMLElement {
  static get is() {
    return 'hughs-vlog-footer';
  }

  static get template() {
    return `
      <template id="${HughsVlogFooter.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            text-align: center;
          }
        </style>
        <p>© 2016–<span id="current-year"></span></p>
      </template>
    `;
  }

  connectedCallback() {
    const $currentYear = this.$template.content.querySelector( '#current-year' );
    $currentYear.textContent = this.currentYear;
    this.setAttribute( 'role', 'contentinfo' );
  }

  get currentYear() {
    return new Date().getFullYear().toString();
  }
}

HughsVlogFooter = HughsVlogElement( HughsVlogFooter );

window.customElements.define( HughsVlogFooter.is, HughsVlogFooter );
