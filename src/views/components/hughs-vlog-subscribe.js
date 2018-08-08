"use strict";
import HughsVlogElement from '../../lib/hughs-vlog-element.js';
import injectSharedStyles from '../../lib/inject-shared-styles.js';

let HughsVlogSubscribe = class HughsVlogSubscribe extends HTMLElement {
  static get is() {
    return 'hughs-vlog-subscribe';
  }

  static get template() {
    return injectSharedStyles(`
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
            background: transparent;
            /*padding: 1rem;*/
            /*margin: 1rem auto;*/
          }

          :host([nite]) {
            color: white;
            /*background: rgba(238, 238, 238, 0.25);*/
            /*background: rgba(255, 255, 255, 0.25);*/
          }

          .title {
            margin-top: 0;
          }

          .h.h--2,
          .h.h--3 {
            text-align: var(--title-align);
          }

          dl {
            height: 56px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
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

          /*dt {
            /* @todo: sr-only */
            display: none;
          }*/

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

          :host([nite]) .subscribe-button-container.subscribe-button-container--yt {
            border-right: 1px solid rgba(255,255,255,0.75);
          }

          .sr-only {
            @apply --sr-only;
          }

          /*fb:like {
            @apply --fb-like;
          }*/

          /*fb|like {
            @apply --fb-like;
          }*/
        </style>
        <h2 class="title sr-only">Subscribe</h2>
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
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FHughsVlog&amp;tabs&amp;width=197&amp;height=70&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=false&amp;appId=1117428231678998"
                width="197"
                height="72"
                style="border:none;overflow:hidden"
                scrolling="no"
                frameborder="0"
                allowTransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          </dd>
          <dt class="sr-only">Twitter</dt>
          <dd class="subscribe-button-container subscribe-button-container--twttr">
            <div id="twttr-button-container-render" class="subscribe-button-container__render"></div>
          </dd>
          <!-- <dt>hugh.today</dt> -->
          <!-- <dd></dd> -->
        </dl>
        <!-- <slot></slot> -->
      </template>
    `);
  }

  static get youtubeChannelID() {
    return 'UCGPCcxdykgp6hgvL0XE3yaA';
  }

  connectedCallback() {
    this.setAttribute( 'role', 'complementary' );
    this.$.fbButtonContainerRender = this.$id( 'fb-button-container-render' );
    this.$.ytButtonContainerRender = this.$id( 'yt-button-container-render' );
    this.$.twttrButtonContainerRender = this.$id( 'twttr-button-container-render' );

    this.render();
  }

  renderFbLikeButton() {
    window.FB.XFBML.parse( ( this.shadowRoot || document ).getElementById( 'fb-button-container-render' ), () => {
      if ( this.$.fbButtonContainerRender ) {
        this.$.fbButtonContainerRender.classList.add( 'subscribe-button-container__render--loaded' );
      }
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

    let i = 0;
    let intervalTimeout = 0.125 /* minute(s) */ * ( 60 * 1000 );
    const checkIfYtSubscribeButtonIsRendered = window.setInterval( () => {
      ++i;
      if ( i <= intervalTimeout ) {
        // console.log( 'Checking for YT button' );
        if ( this.$.ytButtonContainerRender && this.$.ytButtonContainerRender.children.length ) {
          // First and only child should be an iframe so we will trust that it is
          this.$.ytButtonContainerRender.children[0].onload = () => {
            this.$.ytButtonContainerRender.classList.add( 'subscribe-button-container__render--loaded' );
          };

          // Clear the interval as soon as a child is appended;
          // the onload gives us a true callback and obviates the need for it
          // console.log( 'YT button rendered; interval cleared' );
          window.clearInterval( checkIfYtSubscribeButtonIsRendered );
        }
      } else {
        console.log( `YT button not rendered after ${intervalTimeout / 1000} seconds; interval cleared` );
        window.clearInterval( checkIfYtSubscribeButtonIsRendered );
      }
    }, 1 );
  }

  renderTwitterFollowButton() {
    window.twttr.widgets.createFollowButton(
      'HughsVlog',
      this.$.twttrButtonContainerRender,
      {
        size: 'large'
      }
    ).then( ( element ) => {
      this.$.twttrButtonContainerRender.classList.add( 'subscribe-button-container__render--loaded' );
    } );
  }

  render() {
    this.renderYtSubscribeButton();
    this.renderFbLikeButton();
    this.renderTwitterFollowButton();
  }
}

HughsVlogSubscribe = HughsVlogElement( HughsVlogSubscribe );

window.customElements.define( HughsVlogSubscribe.is, HughsVlogSubscribe );

export default HughsVlogSubscribe;
