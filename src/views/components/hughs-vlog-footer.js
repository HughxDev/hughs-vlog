"use strict";
import { parseHTML } from '/lib/dom.js';

class HughsVlogFooter extends HTMLElement {
  static get template() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          text-align: center;
        }
      </style>
      <p>© 2016–<span id="current-year"></span></p>
    `;
  }

  constructor() {
    super();

    const $shadowRoot = this.attachShadow( { mode: 'open' } );
    const $shadowContent = parseHTML( HughsVlogFooter.template );
    const $currentYear = $shadowContent.querySelector( '#current-year' );

    $currentYear.textContent = this.currentYear;
    $shadowRoot.appendChild( $shadowContent );
  } // constructor

  connectedCallback() {
    this.setAttribute( 'role', 'contentinfo' );
  }

  get currentYear() {
    return new Date().getFullYear().toString();
  }
}

window.customElements.define( 'hughs-vlog-footer', HughsVlogFooter );
