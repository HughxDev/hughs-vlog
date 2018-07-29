"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

let HughsVlogSiteNav = class HughsVlogSiteNav extends HTMLElement {
  static get is() {
    return 'hughs-vlog-site-nav';
  }

  static get template() {
    return `
      <template id="${HughsVlogSiteNav.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            text-align: center;
            display: flex;
            flex-direction: row;
            margin: .5rem auto;
          }

          ::slotted(a) {
            flex: 1;
            background-color: black;
            color: white;
            margin: 0 0.25rem;
            padding: .5rem;
            text-decoration: none;
            /*font-weight: bold;*/
          }

          :host([nite]) ::slotted(a) {
            background-color: white;
            color: black;
          }

          ::slotted(a:hover),
          ::slotted(a:active),
          ::slotted(a:focus),
          ::slotted(.router-link-active) {
            text-decoration: underline;
          }

          ::slotted(a:first-of-type) {
            margin-left: 0;
          }

          ::slotted(a:last-of-type) {
            margin-right: 0;
          }

          ::slotted(.middle) {
            flex: 2;
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
    this.setAttribute( 'role', 'navigation' );
  }
}

HughsVlogSiteNav = HughsVlogElement( HughsVlogSiteNav );

window.customElements.define( HughsVlogSiteNav.is, HughsVlogSiteNav );

export default HughsVlogSiteNav;
