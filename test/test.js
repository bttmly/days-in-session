var should = require( 'chai' ).should();

var daysInSession = require( '..' );

describe( 'Calling it with a year', function () {
  it( 'Should return results for that year', function ( done ) {

    daysInSession( 2013 ).then( function ( days ) {
      days.every( function ( str ) {
        return str.contains("2013");
      }).should.equal( true );
      done();
    });

  });
});

describe( 'Calling it with a congress number', function () {
  it( 'Should return results for both years of that congress', function ( done ) {

    daysInSession( 113 ).then( function ( days ) {
      days.every( function ( str ) {
        return str.contains( "2013" ) || str.contains( "2014" );
      }).should.equal( true );
      done();
    });

  });
});
