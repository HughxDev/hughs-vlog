"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlogEpisodeNav extends HTMLElement {
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

        .archive {
          flex: 2;
        }
      </style>
      <a href="javascript:void(0);">First</a>
      <a href="javascript:void(0);">Previous</a>
      <a class="archive" href="javascript:void(0);">Random</a>
      <!-- <a class="archive" href="javascript:void(0);">Archive</a>  -->
      <a href="javascript:void(0);">Next</a>
      <a href="javascript:void(0);">Latest</a>
    `;
  }

  constructor() {
    super();
    attachShadowDOM( this, HughsVlogEpisodeNav );
  }

  connectedCallback() {
    this.setAttribute( 'role', 'navigation' );
  }
}

window.customElements.define( 'hughs-vlog-episode-nav', HughsVlogEpisodeNav );
