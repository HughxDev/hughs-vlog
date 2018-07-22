"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlogSiteNav extends HTMLElement {
  static get template() {
    return `
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
    `;
  }

  constructor() {
    super();
    attachShadowDOM( this, HughsVlogSiteNav );
  }

  connectedCallback() {
    this.setAttribute( 'role', 'navigation' );
  }
}

window.customElements.define( 'hughs-vlog-site-nav', HughsVlogSiteNav );
