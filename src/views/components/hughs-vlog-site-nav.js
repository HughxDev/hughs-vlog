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
            flex-direction: column;
            margin: auto .5rem;
          }

          @media only screen and ( min-width: 32em ) {
            :host {
              flex-direction: row;
              margin: .5rem auto;
            }
          }

          :host([pills]) {
            margin: 2rem auto;
            width: 80%;
            max-width: 39rem;
          }

          ::slotted(a) {
            flex: 1;
            background-color: black;
            color: white;
            margin: 0.25rem 0;
            padding: .5rem;
            text-decoration: none;
            /*font-weight: bold;*/
          }

          @media only screen and ( min-width: 32em ) {
            ::slotted(a) {
              margin: 0 0.25rem;
            }
          }

          :host([nite]) ::slotted(a) {
            background-color: white;
            color: black;
          }

          :host([pills]) ::slotted(a) {
            color: white;
            transition: background-color 0.2s ease;
            background-color: transparent;
            border: 2px solid white;
            border-radius: 30px;
            text-decoration: none;
          }

          :host([pills]) ::slotted(a:hover),
          :host([pills]) ::slotted(a:active),
          :host([pills]) ::slotted(a:focus),
          :host([pills]) ::slotted(.router-link-active) {
            color: black;
            background-color: white;
            text-decoration: none;
          }

          ::slotted(a:hover),
          ::slotted(a:active),
          ::slotted(a:focus),
          ::slotted(.router-link-active) {
            text-decoration: underline;
          }

          @media only screen and ( min-width: 32em ) {
            ::slotted(a:first-of-type) {
              margin-left: 0;
            }

            ::slotted(a:last-of-type) {
              margin-right: 0;
            }
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
