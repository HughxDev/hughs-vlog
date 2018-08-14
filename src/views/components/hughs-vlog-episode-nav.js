"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

class HughsVlogEpisodeNav extends HTMLElement {
  static get is() {
    return 'hughs-vlog-episode-nav';
  }

  static get template() {
    return `
      <template id="${HughsVlogEpisodeNav.is}">
        <style>
          * {
            box-sizing: border-box;
          }

          :host {
            text-align: center;
            display: flex;
            flex-direction: row;
            margin: .5rem auto;
            flex-wrap: wrap;
          }

          a {
            flex: 1;
            background-color: black;
            color: white;
            margin: 0.25rem;
            padding: .5rem;
            text-decoration: none;
          }

          /*:host([nite]) a {
            background-color: white;
            color: black;
          }*/

          a:hover,
          a:focus {
            text-decoration: underline;
          }

          @media only screen and ( max-width: 32em ) {
            a:first-of-type,
            a:last-of-type {
              min-width: 100%;
            }
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

          :host([latest]) #next,
          :host([latest]) #latest,
          :host([latest]) #next:hover,
          :host([latest]) #latest:hover,
          :host([latest]) #next:focus,
          :host([latest]) #latest:focus {
            cursor: not-allowed;
            background-color: transparent;
            opacity: 0.5;
            color: white;
          }
        </style>
        <a id="first" href="javascript:void(0);">First</a>
        <a id="previous" href="javascript:void(0);">Previous</a>
        <a id="random" class="archive" href="javascript:void(0);">Random</a>
        <!-- <a class="archive" href="javascript:void(0);">Archive</a>  -->
        <a id="next" class="next" href="javascript:void(0);">Next</a>
        <a id="latest" class="latest" href="javascript:void(0);">Latest</a>
      </template>
    `;
  }

  connectedCallback() {
    this.setAttribute( 'role', 'navigation' );
  }
}

HughsVlogEpisodeNav = HughsVlogElement( HughsVlogEpisodeNav );

window.customElements.define( HughsVlogEpisodeNav.is, HughsVlogEpisodeNav );

export default HughsVlogEpisodeNav;
