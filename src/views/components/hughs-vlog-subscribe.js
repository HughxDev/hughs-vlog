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
          }

          :host([nite]) {
            color: white;
            background: transparent;
          }

          .title {
            margin-top: 0;
          }

          .h.h--2,
          .h.h--3 {
            text-align: var(--title-align);
          }

          .via {
            min-height: 56px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
          }

          .via.via--feed-reader {
            width: 310px;
          }

          dd {
            margin-left: 0;
          }

          .subscribe-button-container {
            padding-left: 1rem;
            padding-right: 1rem;
            /*border-right: 1px solid rgba(0,0,0,0.25);*/
            border-right: 1px solid transparent;
            height: 100% !important;
            min-height: 78px !important;
            display: flex;
            justify-content: center;
            flex-direction: column;
          }

          .subscribe-button-container,
          .subscribe-button-container:first-of-type:last-of-type {
            align-items: center;
          }

          .subscribe-button-container:first-of-type {
            align-items: flex-end;
          }

          .subscribe-button-container:last-of-type {
            align-items: flex-start;
          }

          /*.subscribe-button-container.subscribe-button-container--yt {
            width: 191px;
          }*/

          /*.subscribe-button-container.subscribe-button-container--fb {
            width: 230px;
          }*/

          /*.subscribe-button-container.subscribe-button-container--twttr {
            width: 252px;
          }*/

          .subscribe-button-container {
            width: 252px;
          }

          .subscribe-button-container__render {
            transition: opacity ease-in 0.2s;
            opacity: 0;
          }

          .subscribe-button-container__render.subscribe-button-container__render--loaded {
            opacity: 1;
          }

          :host([nite]) .subscribe-button-container {
            /*border-color: rgba(255,255,255,0.75);*/
            border-color: transparent;
          }

          .subscribe-button-container:first-of-type {
            padding-left: 0;
          }

          .subscribe-button-container:last-of-type {
            border-right: none;
            padding-right: 0;
          }

          .sr-only {
            @apply --sr-only;
          }

          .nb {
            text-align: center;
            font-size: 0.9em;
            font-style: italic;
          }

          .h + .nb {
            margin-top: -1rem;
          }

          section + section {
            margin-top: 3rem;
          }
        </style>
        <h2 class="title sr-only">Subscribe</h2>
        <section id="via-social-network">
          <h3 class="h h--3">via Social Network</h3>
          <dl class="via via--social-network">
            <dt class="sr-only">YouTube</dt>
            <dd class="subscribe-button-container subscribe-button-container--yt">
              <div id="yt-button-container-render" class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <!--<div class="g-ytsubscribe"></div>-->
                <iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 174px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;" tabindex="0" vspace="0" width="100%" id="I3_1534220345752" name="I3_1534220345752" src="https://www.youtube.com/subscribe_embed?usegapi=1&amp;channelid=UCGPCcxdykgp6hgvL0XE3yaA&amp;layout=full&amp;theme=dark&amp;origin=http%3A%2F%2Fhugh.today&amp;gsrc=3p&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_US.E7IKfRnB0v0.O%2Fam%3DwQ%2Frt%3Dj%2Fd%3D1%2Frs%3DAGLTcCOByCbQXAC-9aHy9Cd48zYIgEVgQw%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh&amp;id=I3_1534220345752&amp;_gfid=I3_1534220345752&amp;parent=http%3A%2F%2Fhugh.today&amp;pfname=&amp;rpctoken=91374745" data-gapiattached="true" class="style-scope hughs-vlog-subscribe"></iframe>
              </div>
            </dd>
            <dt class="sr-only">Facebook</dt>
            <dd class="subscribe-button-container subscribe-button-container--fb">
              <div id="fb-button-container-render" class="subscribe-button-container__render subscribe-button-container__render--loaded">
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
              <div id="twttr-button-container-render" class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <iframe id="twitter-widget-0" scrolling="no" frameborder="0" allowtransparency="true" class="twitter-follow-button twitter-follow-button-rendered style-scope hughs-vlog-subscribe" style="position: static; visibility: visible; width: 236px; height: 28px;" title="Twitter Follow Button" src="https://platform.twitter.com/widgets/follow_button.1025be460f33762a866ea882e1687ff4.en.html#dnt=false&amp;id=twitter-widget-0&amp;lang=en&amp;screen_name=HughsVlog&amp;show_count=true&amp;show_screen_name=true&amp;size=l&amp;time=1534220429470" data-screen-name="HughsVlog"></iframe>
              </div>
            </dd>
            <!-- <dt>hugh.today</dt> -->
            <!-- <dd></dd> -->
          </dl>
        </section>
        <section id="via-podcast-app">
          <h3 class="h h--3">via Podcast App</h3>
          <p class="nb">Note: These link to a video podcast feed.</p>
          <dl class="via via--podcast-app">
            <dt class="sr-only">Apple Podcasts (iTunes)</dt>
            <dd class="subscribe-button-container subscribe-button-container--itunes">
              <div class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <a
                  href="javascript:void(0);"
                  target="blank"
                >
                  <img src="/img/apple-podcasts-listen-badge.svg" height="56" alt="Listen on Apple Podcasts" />
                </a>
              </div>
            </dd>
            <dt class="sr-only">Pocket Casts</dt>
            <dd class="subscribe-button-container subscribe-button-container--pocket-casts">
              <div class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <a href="javascript:void(0);">
                  <img src="/img/pocketcasts-large-light.svg" height="72" alt="Subscribe in Pocket Casts" />
                </a>
              </div>
            </dd>
          </dl>
        </section>
        <section id="via-feed-reader">
          <h3 class="h h--3">via Feed Reader</h3>
          <dl class="via via--feed-reader">
            <dt class="sr-only">Flipboard</dt>
            <dd class="subscribe-button-container subscribe-button-container--flipboard">
              <div class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <a
                  data-href="https://flipboard.com/@hughguiney?utm_campaign=tools&utm_medium=follow&action=follow"
                  href="javascript:void(0);"
                >
                  <img src="/img/flipboard-logo.svg" height="56" alt="Flipboard" />
                </a>
                <!--<script src="https://cdn.flipboard.com/web/buttons/js/flbuttons.min.js" type="text/javascript"></script>-->
              </div>
            </dd>
            <dt class="sr-only">Feedly</dt>
            <dd class="subscribe-button-container subscribe-button-container--feedly">
              <div class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <a
                  data-href='https://feedly.com/i/subscription/feed%2Fhttp%3A%2F%2Fhugh.today%2Ffeed'
                  href="javascript:void(0);"
                  target='blank'>
                    <img id='feedlyFollow'
                      src='http://s3.feedly.com/img/follows/feedly-follow-rectangle-volume-big_2x.png'
                      alt='Follow on feedly'
                      width='131'
                      height='56'
                    />
                </a>
              </div>
            </dd>
            <dt class="sr-only">Raw Feed</dt>
            <dd class="subscribe-button-container subscribe-button-container--feed">
              <div class="subscribe-button-container__render subscribe-button-container__render--loaded">
                <a
                  title="Copy Feed URL to Clipboard"
                  href="http://api.hugh.today/feed/podcast"
                  onclick="alert('URL copied'); event.preventDefault();"
                  target="blank"
                >
                  <img src="/img/feed-icon.svg" width="56" height="56" alt="Icon: RSS/Atom" />
                </a>
              </div>
            </dd>
          </dl>
        </section>
        <!-- <slot></slot> -->
      </template>
    `);
  }

  static get youtubeChannelID() {
    return 'UCGPCcxdykgp6hgvL0XE3yaA';
  }

  connectedCallback() {
    this.setAttribute( 'role', 'complementary' );
    // this.$.rendered = ( this.$.rendered || false );
    this.$.fbButtonContainerRender = this.$id( 'fb-button-container-render' );
    this.$.ytButtonContainerRender = this.$id( 'yt-button-container-render' );
    this.$.twttrButtonContainerRender = this.$id( 'twttr-button-container-render' );

    // if ( !this.$.rendered ) {
      this.render();
    // }
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
    // this.renderYtSubscribeButton();
    // this.renderFbLikeButton();
    // this.renderTwitterFollowButton();
    // this.$.rendered = true;
  }
}

HughsVlogSubscribe = HughsVlogElement( HughsVlogSubscribe );

window.customElements.define( HughsVlogSubscribe.is, HughsVlogSubscribe );

export default HughsVlogSubscribe;
