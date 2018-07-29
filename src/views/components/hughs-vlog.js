"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

import /*HughsVlogHeader from*/ './hughs-vlog-header.js';
import /*HughsVlogPlaybackOptions from*/ './hughs-vlog-playback-options.js';
import /*HughsVlogEpisode from*/ './hughs-vlog-episode.js';
import /*HughsVlogEpisodeNav from*/ './hughs-vlog-episode-nav.js';
import /*HughsVlogFooter from*/ './hughs-vlog-footer.js';

let HughsVlog = class HughsVlog extends HTMLElement {
  // Copying static getter convention from Polymer 3,
  // though not strictly necessary.
  static get is() {
    return 'hughs-vlog';
  }

  static get template() {
    /*
      <script type="module" src="components/hughs-vlog-header.js"></script>
      <script type="module" src="components/hughs-vlog-playback-options.js"></script>
      <script type="module" src="components/hughs-vlog-episode.js"></script>
      <script type="module" src="components/hughs-vlog-episode-nav.js"></script>
      <script type="module" src="components/hughs-vlog-footer.js"></script>
    */
    return `
      <template id="${HughsVlog.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            --sr-only: {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              overflow: hidden;
              clip: rect(0,0,0,0);
              white-space: nowrap;
              clip-path: inset(50%);
              border: 0;
            };
          }

          hughs-vlog-subscribe,
          ::slotted(hughs-vlog-subscribe) {
            @apply --sr-only;
          }

          :host {
            display: block;
            margin: 0 auto;
            max-width: 853px;
            opacity: 1;
            transition: opacity ease-in 0.2s;
          }

          :host([hidden]) {
            opacity: 0;
          }

          ::slotted(main) {
            margin-bottom: 3rem;
          }
        </style>
        <slot></slot>
      </template>
    `;
  }

  connectedCallback() {
    window.customElements.whenDefined( 'hughs-vlog' ).then( () => {
      this.removeAttribute( 'hidden' );
    } );
  }
}

HughsVlog = HughsVlogElement( HughsVlog );

window.customElements.define( HughsVlog.is, HughsVlog );

export default HughsVlog;
