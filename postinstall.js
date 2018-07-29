const read = require( 'fs' ).readFileSync;
const { spawnSync } = require( 'child_process' );
const path = require( 'path' );

const package = JSON.parse( read( './package.json', { "encoding": "UTF-8" } ) );

package._lib.forEach( ( library ) => {
  let dir = path.basename( library );

  // spawnSync( 'rm', [ '-rf', `src/lib/${dir}/` ] );
  spawnSync( 'rm', [ '-rf', `public/lib/${dir}/` ] );
  // spawnSync( 'cp', [ '-r', `node_modules/${library}/`, `src/lib/${dir}` ] );
  spawnSync( 'cp', [ '-r', `node_modules/${library}/`, `public/lib/${dir}` ] );
} );
