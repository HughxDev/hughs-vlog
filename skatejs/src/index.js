import 'whatwg-fetch'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'

import { h } from "preact";
import {define, name} from 'skatejs'

import {Component} from './base'
import { Result } from './Result';

import './style'

const SEARCH = "//api.github.com/search/repositories";

class App extends Component {
  static is = name('x-app')
  static css = `
    .result {
      padding: 10px;
      margin: 10px;
      background: white;
      box-shadow: 0 1px 5px rgba(0,0,0,0.5);
    }
  `
  
  state = {
    results: []
  }
  connected() {
    fetch(`${SEARCH}?q=preact`)
      .then(r => r.json())
      .then(json => {
        this.state = { results: (json && json.items) || []};
      });
  }

  render() {
    const {results} = this.state
    return (
      <div>
        <style>{App.css}</style>
        <h1>Example</h1>
        <div class="list">
          {results.map(result => <Result result={result} />)}
        </div>
      </div>
    );
  }
}

define(App)

if (typeof window !== "undefined") {
  // render(<App />, document.getElementById("root"));
  const root = document.getElementById("root")
  root.innerHTML = `<${App.is}></${App.is}>`
}
