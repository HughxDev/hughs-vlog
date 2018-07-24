"use strict";
import HughsVlogElement from '/lib/hughs-vlog-element.js';

import '/components/hughs-vlog-site-nav.js';
import '/components/hughs-vlog-subscribe.js';

class HughsVlogHeader extends HTMLElement {
  static get is() {
    return 'hughs-vlog-header';
  }

  static get template() {
    return `
      <template id="${HughsVlogHeader.is}">
        <script type="module" src="components/hughs-vlog-site-nav.js"></script>
        <script type="module" src="components/hughs-vlog-subscribe.js"></script>
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
            text-align: center;
            margin: 1.5rem auto 2.5rem;
          }

          a {
            text-decoration: none;
            color: inherit;
          }

          /*a:hover,
          a:focus {
            text-decoration: underline;
          }*/

          .h {
            margin: 0 auto;
          }

          p {
            margin: .5rem auto 1rem;
          }

          .link-wrapper {
            display: block;
          }
        </style>
        <a class="link-wrapper" href="/">
          <h1 class="h h--1">Hugh’s Vlog</h1>
        </a>
        <p>The daily life of a startup founder, programmer, and filmmaker.</p>
        <hughs-vlog-site-nav></hughs-vlog-site-nav>
        <hughs-vlog-subscribe></hughs-vlog-subscribe>
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
