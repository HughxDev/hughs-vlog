import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// import App from './App.vue';

import Site from './views/Site';
import Homepage from './views/Homepage';
import About from './views/About';
import Episodes from './views/Episodes';
import Subscribe from './views/Subscribe';
import Contact from './views/Contact';

Vue.config.productionTip = true;
Vue.config.ignoredElements = [
  /^hughs-vlog-?/
];

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.
Vue.use( VueRouter );
Vue.use( VueResource );

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
  { path: '/', name: 'home', component: Homepage },
  { path: '/about', name: 'about', component: About },
  { path: '/episodes', name: 'episodes', component: Episodes },
  { path: '/subscribe', name: 'subscribe', component: Subscribe },
  { path: '/contact', name: 'contact', component: Contact }
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
  render: h => h( Site )
} ).$mount( '#app' );

// Now the app has started!
