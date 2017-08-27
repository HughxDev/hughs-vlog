const express = require( 'express' );
const app = express();  
const router = express.Router();
const http = require( 'http' );
const httpProxy = require( 'http-proxy' );
// const pug = require( 'pug' );
const searchVideos = require( '../hughs-vlog-api/routes/videos' ).search;

// EJS
const ejs = require( 'ejs' );
const read = require( 'fs' ).readFileSync;
const path = require( 'path' );
const join = path.join;

const formats = {
  "html": {
    "contentType": "application/xhtml+xml",
    // "contentType": "text/html",
    "extensions": [ "html", "xhtml" ]
  },
  "hvml": {
    "contentType": "application/hvml+xml",
    "extensions": [ "hvml", "ovml" ]
  }
};

httpProxy.createProxyServer( {
  "target": "http://local.hugh.today:80"
} ).listen( 11087 );

// use
app.use( '/', router );

app.use( function CORS( req, res, next ) {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE' );
  res.header( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );

  if ('OPTIONS' == req.method) {
    res.sendStatus( 204 );
  } else {
    next();
  }
} );

app.use( function contentType( req, res, next ) {
  // res.contentType( 'application/xhtml+xml' );
  next();
} );

express.static.mime.define({
  'application/xhtml+xml': [ 'html' ],
  'application/hvml+xml': [ 'hvml' ],
});

app.use( '/lib', express.static( join( __dirname, '/src/lib' ) ) );

// set
app.set( 'port', process.env.PORT || 80 );
app.set( 'view engine', 'ejs' );
app.set( 'views', join( __dirname, '/src/views' ) );

app.listen( app.get( 'port' ), function listen() {  
  console.log( 'Express up and listening on port ' + app.get( 'port' ) );
} );

// Routes
app.get( '/components/:component', function getComponent( req, res ) {
  var locals = {};
  // switch ( req.params.component ) {
  //   case 'hughs-vlog':
  //     locals.episode = 'latest';
  //   break;
  // }

  res.set( 'Content-Type', formats.html.contentType );
  res.render( 'components/' + req.params.component.replace( /\.html$/, '' ), locals );
} );

// Permalinks
// /year/month/day
// /[4 digits min]/[01-12]/[01-31]
app.get( '/:year([0-9]{4,})(\/|-):month(0[1-9]|1[0-2])(\/|-):day(0[1-9]|1[0-9]|2[0-9]|3[0-9])', function getEpisode( req, res ) {
  // res.json( req.params );
  var date = req.params.year + '-' + req.params.month + '-' + req.params.day;

  searchVideos( {
    "recorded": date
  } )
  .then( function foundVideos( hvml ) {
    res.setHeader( 'Content-Type', 'application/xml' );
    res.send( hvml );
  } )
  .catch( function couldntFindVideos( error ) {
    res.status( 400 ).send( error );
  } );
} );

app.get( '*', function getHomepage( req, res ) {
  // res.write( compiled );
  res.set( 'Content-Type', formats.html.contentType );
  res.render( 'index', function render( err, html ) {
    res.write( html );
  } );

  res.end();
} );