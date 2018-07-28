import Vue from 'vue';
import VueRouter from 'vue-router';
// import App from './App.vue';

import HughsVlogSite from './views/HughsVlogSite';
import HughsVlogHomepage from './views/HughsVlogHomepage';
import HughsVlogAbout from './views/HughsVlogAbout';
import HughsVlogEpisodes from './views/HughsVlogEpisodes';

Vue.config.productionTip = true;
Vue.config.ignoredElements = [
  /^hughs-vlog-?/
];

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.
Vue.use( VueRouter );

// 1. Define route components.
// These can be imported from other files
// const Foo = { template: '<div>foo</div>' };
// const Bar = { template: '<div>bar</div>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', name: 'home', component: HughsVlogHomepage },
  { path: '/about', name: 'about', component: HughsVlogAbout },
  { path: '/episodes', name: 'episodes', component: HughsVlogEpisodes }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
  "mode": "history"
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
// const app =
new Vue( {
  router,
  render: h => h( HughsVlogSite )
} ).$mount( '#app' );

// Now the app has started!
