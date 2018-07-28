"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';

let HughsVlogSubscribe = class HughsVlogSubscribe extends HTMLElement {
  static get is() {
    return 'hughs-vlog-subscribe';
  }

  static get template() {
    return `
      <template id="${HughsVlogSubscribe.is}">
        <style>
          /*@namespace "http://www.w3.org/1999/xhtml";*/
          @namespace fb "http://www.facebook.com/2008/fbml";

          * {
            box-sizing: border-box;
          }

          :host {
            display: block;
            background: #eee;
            background: white;
            padding: 1rem;
            margin: 1rem auto;
          }

          :host([nite]) {
            color: white;
            background: rgba(238, 238, 238, 0.25);
            background: rgba(255, 255, 255, 0.25);
          }

          .h {
            margin-top: 0;
          }

          dl {
            height: 56px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            display: flex;
          }

          dd {
            margin-left: 0;
          }

          /*dt:first-of-type + dd::after {
            content: '';
            opacity: 0.25;
            display: inline-block;
            border-right: 1px solid black;
            margin-right: 1rem;
            padding-right: 1rem;
            width: 0;
            height: 100%;
          }*/

          dt {
            /* @todo: sr-only */
            display: none;
          }

          .subscribe-button-container {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            flex: 1;
            display: flex;
            align-items: center;
          }

          .subscribe-button-container__render {
            transition: opacity ease-in 0.2s;
            opacity: 0;
          }

          .subscribe-button-container__render.subscribe-button-container__render--loaded {
            opacity: 1;
          }

          .subscribe-button-container.subscribe-button-container--fb {
            text-align: left;
            justify-content: flex-start;
            padding-left: 1rem;
          }

          .subscribe-button-container.subscribe-button-container--yt {
            text-align: right;
            justify-content: flex-end;
            padding-right: 1rem;
            border-right: 1px solid rgba(0,0,0,0.25);
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            clip-path: inset(50%);
            border: 0;
          }

          /*fb:like {
            @apply --fb-like;
          }*/

          /*fb|like {
            @apply --fb-like;
          }*/
        </style>
        <h2 class="h h--2">Subscribe</h2>
        <dl>
          <dt class="sr-only">YouTube</dt>
          <dd class="subscribe-button-container subscribe-button-container--yt">
            <div id="yt-button-container-render" class="subscribe-button-container__render">
              <div class="g-ytsubscribe"></div>
            </div>
          </dd>
          <dt class="sr-only">Facebook</dt>
          <dd class="subscribe-button-container subscribe-button-container--fb">
            <div id="fb-button-container-render" class="subscribe-button-container__render">
              <!-- layout="button_count" -->
              <fb:like
                href="https://www.facebook.com/HughsVlog/"
                action="like"
                width="116"
                size="small"
                show-faces="true"
                share="false"
                colorscheme="dark"
                ></fb:like>
            </div>
          </dd>
          <!-- <dt>hugh.today</dt> -->
          <!-- <dd></dd> -->
        </dl>
      </template>
    `;
  }

  static get youtubeChannelID() {
    return 'UCGPCcxdykgp6hgvL0XE3yaA';
  }

  connectedCallback() {
    this.setAttribute( 'role', 'complementary' );
    this.$.fbButtonContainerRender = this.$id( 'fb-button-container-render' );
    this.$.ytButtonContainerRender = this.$id( 'yt-button-container-render' );

    this.render();
  }

  renderFbLikeButton() {
    window.FB.XFBML.parse( ( this.shadowRoot || document ).getElementById( 'fb-button-container-render' ), () => {
      this.$.fbButtonContainerRender.classList.add( 'subscribe-button-container__render--loaded' );
    } );
  }

  // https://developers.google.com/youtube/subscribe/reference
  renderYtSubscribeButton( channelID ) {
    channelID = channelID || HughsVlogSubscribe.youtubeChannelID;

    console.log( 'channelID', channelID );

    var container = this.$id( 'yt-button-container-render' );
    var options = {
      "channelId": channelID,
      // "layout": "default"
      "layout": "full",
      "theme": "dark"
    };

    window.gapi.ytsubscribe.render( container, options );

    const checkIfYtSubscribeButtonIsRendered = window.setInterval( () => {
      if ( this.$.ytButtonContainerRender.children.length ) {
        // First and only child should be an iframe so we will trust that it is
        this.$.ytButtonContainerRender.children[0].onload = () => {
          this.$.ytButtonContainerRender.classList.add( 'subscribe-button-container__render--loaded' );
        };

        // Clear the interval as soon as a child is appended;
        // the onload gives us a true callback and obviates the need for it
        window.clearInterval( checkIfYtSubscribeButtonIsRendered );
      }
    }, 1 );
  }

  render() {
    this.renderYtSubscribeButton();
    // this.renderFbLikeButton();
  }
}

HughsVlogSubscribe = HughsVlogElement( HughsVlogSubscribe );

window.customElements.define( HughsVlogSubscribe.is, HughsVlogSubscribe );

export default HughsVlogSubscribe;
