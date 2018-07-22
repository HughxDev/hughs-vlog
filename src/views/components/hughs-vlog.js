"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlog extends HTMLElement {
  // Copying static getter convention from Polymer 3,
  // though not strictly necessary.
  static get template() {
    return `
      <script type="module" src="components/hughs-vlog-header.js"></script>
      <script type="module" src="components/hughs-vlog-playback-options.js"></script>
      <script type="module" src="components/hughs-vlog-episode.js"></script>
      <script type="module" src="components/hughs-vlog-episode-nav.js"></script>
      <script type="module" src="components/hughs-vlog-footer.js"></script>
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          display: block;
          margin: 0 auto;
          max-width: 853px;
        }

        main {
          margin-bottom: 3rem;
        }
      </style>
      <hughs-vlog-header></hughs-vlog-header>
      <main>
        <h2>It works!</h2>
        <slot></slot>
        <hughs-vlog-playback-options></hughs-vlog-playback-options>
        <hughs-vlog-episode-nav></hughs-vlog-episode-nav>
      </main>
      <hughs-vlog-footer></hughs-vlog-footer>
    `;
  }

  // Remember to call the super method here
  constructor() {
    super();
    // attachShadowDOM( elementInstance, ElementClass, mode )
    attachShadowDOM( this, HughsVlog );
  }
}

window.customElements.define( 'hughs-vlog', HughsVlog );
