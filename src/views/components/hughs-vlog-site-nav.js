"use strict";
import HughsVlogElement from '/lib/hughs-vlog-element.js';

class HughsVlogSiteNav extends HTMLElement {
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

          a {
            flex: 1;
            background-color: black;
            color: white;
            margin: 0 0.25rem;
            padding: .5rem;
          }

          a:hover,
          a:focus {
            text-decoration: none;
          }

          a:first-of-type {
            margin-left: 0;
          }

          a:last-of-type {
            margin-right: 0;
          }

          .middle {
            flex: 2;
          }
        </style>
        <a href="javascript:void(0);">About</a>
        <a href="/episodes">Episodes</a>
        <!-- <a class="middle" href="javascript:void(0);">Companion Blog</a>  -->
        <a href="javascript:void(0);">Contact</a>
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
