const assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

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
    "module": {
      "rules": [
        {
          "test": /\.scss$/,
          "use": [
            // "style-loader", // creates style nodes from JS strings
            // "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS
          ]
        },
        // {
        //   "test": /\.(gif|png|jpe?g|svg|webp|webm|mov|mpe?g|mp4|mp3|wav)$/i,
        //   "use": [
        //     {
        //       "loader": "url-loader",
        //       "options": {
        //         "name": "/img/[name].[ext]", //_[hash:7]
        //       }
        //     },
        //   ]
        // }
        // {
        //   "test": /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //   "loader": "url-loader",
        //   "options": {
        //     "limit": 10000,
        //     "name": assetsPath( 'img/[name].[ext]' )
        //   }
        // },
      ]
    }
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
