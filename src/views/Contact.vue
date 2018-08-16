<template>
  <div>
    <h2 class="sr-only">Contact</h2>
    <h3 class="h h--3">E-mail</h3>
    <div class="input-copy">
      <input id="input" class="input-copy__input" type="email" value="how're@hugh.today" onfocus="this.select();" onmouseup="return false;" readonly="readonly" />
      <button title="Copy to clipboard" class="input-copy__button" v-on:click="copy">📋</button>
    </div>
    <h3 class="h h--3">Twitter</h3>
    <dl class="inline">
      <dt>Personal</dt>
      <dd><a href="https://twitter.com/LordPancreas" rel="me">LordPancreas</a></dd>
      <dt>RedBlue</dt>
      <dd><a href="https://twitter.com/RedBlueVideo" rel="me">RedBlueVideo</a></dd>
      <dt>Tech-only</dt>
      <dd><a href="https://twitter.com/TurboHax" rel="me">TurboHax</a></dd>
    </dl>
  </div>
</template>

<script>
  export default {
    name: 'Contact',
    props: {},
    methods: {
      copy: function ( event ) {
        var copyText = document.getElementById( 'input' );
        copyText.select();
        document.execCommand( 'copy' );
        alert( 'Copied' );
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped="scoped">
  @import 'helpers';

  .sr-only {
    @include sr-only();
  }

  .input-copy__input {
    text-align: right;
    padding: .5rem;
    width: 243px;
    display: inline-block;
    vertical-align: top;
    height: 48px;
    border-top-left-radius: 3rem;
    border-bottom-left-radius: 3rem;
    border: 1px solid hsla(0, 0%, 0%, 0);
  }

  .input-copy__button {
    padding: 0.5rem;
    height: 48px;
    display: inline-block;
    vertical-align: top;
    border: 1px solid hsla(0, 0%, 0%, 0);
    font-size: 1.5rem;
    background: hsl(210, 13%, 50%);
    border-top-right-radius: 3rem;
    border-bottom-right-radius: 3rem;
    width: 52px;
    text-align: left;
    line-height: 0;
  }

  div {
    text-align: center;
  }

  input {
    font-size: 1.5rem;
  }

  dl {
    text-align: left;
    max-width: 39rem;
    margin: 0 auto;
  }
  dl.inline > dt {
    /* font-weight: bold; */
    text-align: right;
    vertical-align: baseline;
  }

  dl.inline > dt::after {
    content: '\00a0\00a0';
  }

  dl.inline > dt,
  dl.inline > dd {
    width: 50%;
    margin-bottom: 1rem;
    display: inline-block;
  }

  dl.inline > dd {
    margin-left: 0;
  }

  dl.inline > dd:after {
    content: "\A";
    white-space: pre;
  }
</style>
