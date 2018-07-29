module.exports = {
  "chainWebpack": config => {
    config
      .plugin( 'html' )
      .tap( args => {
        // console.log( process.env, process.env );
        if ( process.env.NODE_ENV === 'development' ) {
          args[0].template = './src/index.html';
        }
        return args;
      } )
    ;
  },
  "configureWebpack": {
    "resolve": {
      "alias": {
        "vue$": "vue/dist/vue.esm.js"
      }
    },
  },
  // devServer: {
  //   historyApiFallback: true,
  //   noInfo: true,
  //   proxy: {
  //     "/components": {
  //       target: "http://localhost:80",
  //       secure: false
  //     },
  //     "/lib": {
  //       target: "http://localhost:80",
  //       secure: false
  //     },
  //     // "/components": {
  //     //   target: "http://localhost:80",
  //     //   secure: false
  //     // }
  //   }
  // }
  // "css": {
  //   "loaderOptions": {
  //     // css: {},
  //     "postcss": {
  //       "plugins": {
  //         "autoprefixer": false
  //       }
  //     }
  //   }
  // }
}
