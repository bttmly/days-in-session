var request = require( 'request' );
var cheerio = require( 'cheerio' );
var Promise = require( 'es6-promise' ).Promise;

if ( !String.prototype.contains ) {
  String.prototype.contains = function () {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
  };
}

var containsAny = function ( str, arr ) {
  return arr.some( function ( item ) {
    return str.contains( item );
  });
};

var FIRST_YEAR = 1995;
var LAST_YEAR = 2014;
var FIRST_CONGRESS = 104;
var LAST_CONGRESS = 113;

var RANGE_ERR_MSG = [
  "Pass in a year between ",
  FIRST_YEAR,
  " and ",
  LAST_YEAR,
  " or a Congress number between ",
  FIRST_CONGRESS,
  " and ",
  LAST_CONGRESS,
  "."
].join( "" );

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

var yearToCongress = ( function () {
  var obj = {};
  var i = 0;
  var j = 0;
  while ( i <= LAST_YEAR - FIRST_YEAR ) {
    obj[FIRST_YEAR + i] = FIRST_CONGRESS + j;
    i++;
    obj[FIRST_YEAR + i] = FIRST_CONGRESS + j;
    i++;
    j++;
  }
  return obj;
})();

var reduce =  Function.prototype.call.bind( Array.prototype.reduce );

module.exports = function ( param ) {
  return new Promise( function ( resolve, reject ) {
    var congress, year;
    param = String( param );
    var num = Number( param );


    if ( param.length === 3 && num >= FIRST_CONGRESS && num <= LAST_CONGRESS ) {
      congress = param;
    } else if ( param.length === 4 && num >= FIRST_YEAR && num <= LAST_YEAR ) {
      year = param;
    } else {
      reject( new RangeError( RANGE_ERR_MSG ) );
    }

    if ( !congress ) {
      congress = yearToCongress[ year ];
    }

    var url = "https://beta.congress.gov/congressional-record/" + congress + "-congress/browse-by-date";

    request( url, function ( err, resp, body ) {
      if ( err ) reject( err );
      var $ = cheerio.load( body );
      var days = reduce( $( "td" ), function ( acc, item ) {
        if ( item && item.children && item.children[0] && item.children[0].data ) {
          var text = item.children[0].data;
          if ( containsAny( text, months ) ) {
            acc.push( text.split( "-" )[0].trim() );
          }
        }
        return acc;
      }, [] );

      if ( year ) {
        days = days.filter( function ( str ) {
          return str.contains( year );
        });
      }

      resolve( days );

    });
  });
};
