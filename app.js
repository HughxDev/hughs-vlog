const express = require( 'express' );
const app = express();  
const router = express.Router();
const http = require( 'http' );
const httpProxy = require( 'http-proxy' );
// const pug = require( 'pug' );

// EJS
const ejs = require( 'ejs' );
const read = require( 'fs' ).readFileSync;
const path = require( 'path' );
const join = path.join;

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
  res.contentType( 'application/xhtml+xml' );
  next();
} );

app.use( '/lib', express.static( 'lib' ) );

// set
app.set( 'port', process.env.PORT || 80 );
app.set( 'view engine', 'ejs' );
app.set( 'views', join( __dirname, '/src/views' ) );

app.listen( app.get( 'port' ), function listen() {  
  console.log( 'Express up and listening on port ' + app.get( 'port' ) );
} );

// Routes
app.get( '/', function getHomepage( req, res ) {
  // res.write( compiled );
  res.render( 'index', function render( err, html ) {
    res.write( html );
  } );

  res.end();
} );

app.get( '/components/:component', function getComponent( req, res ) {
  res.render( 'components/' + req.params.component.replace( /\.html$/, '' ) );
} );

