class HughsVlog extends HTMLElement {
  
  // Remember to call the super method here
  constructor() {
    super();
  }
  
  // This a lifecyle call back that gets called
  // when the custom element is attached to the DOM
  connectedCallback() {
    this.innerHTML = 'This is a custom element'
  }
}

window.customElements.define( 'hughs-vlog', HughsVlog );