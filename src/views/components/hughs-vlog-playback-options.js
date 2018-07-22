"use strict";
import { attachShadowDOM } from '/lib/dom.js';

class HughsVlogPlaybackOptions extends HTMLElement {
  static get template() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        a:hover,
        a:focus {
          text-decoration: none;
        }

        :host {
          margin: 1rem auto;
          display: block;
          text-align: center;
        }

        .toggle {
          display: inline-block;
        }

        .toggle:first-of-type {
          margin-right: .25rem;
        }

        .toggle__input {
          /*margin: 0;*/
          position: relative;
          top: 1px;
          margin-right: 0.4rem;
        }

        .toggle__input,
        .toggle__label {
          display: inline-block;
          vertical-align: middle;
        }

        /*.toggle__label {
          font-size: 1.5em;
        }*/
      </style>
      <span class="toggle">
        <input id="marathon-mode" class="toggle__input" name="marathonMode" type="checkbox" /><label for="marathon-mode" class="toggle__label">Marathon Mode</label>
      </span>
      <span class="toggle">
        <input id="shuffle" class="toggle__input" name="shuffle" type="checkbox" disabled="disabled" /><label for="shuffle" class="toggle__label">Shuffle</label>
      </span>
    `;
  }

  constructor() {
    super();
    attachShadowDOM( this, HughsVlogPlaybackOptions );
  }

  connectedCallback() {
    this.setAttribute( 'role', 'navigation' );
  }
}

window.customElements.define( 'hughs-vlog-playback-options', HughsVlogPlaybackOptions );
