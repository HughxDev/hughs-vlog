"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlogHeader extends HTMLElement {
  static get template() {
    return `
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
    `;
  }

  constructor() {
    super();
    attachShadowDOM( this, HughsVlogHeader );
  }

  connectedCallback() {
    this.setAttribute( 'role', 'banner' );
  }
}

window.customElements.define( 'hughs-vlog-header', HughsVlogHeader );
