//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

// in order to replace the € and m² present in the data by nothing -> data=int
function Remplace( expr, a, b ) {
    var i = 0
    while ( i != -1 ) {
        i = expr.indexOf( a, i );
        if ( i >= 0 ) {
            expr = expr.substring( 0, i ) + b + expr.substring( i + a.length );
            i += b.length;
        }
    }
    return expr
}


//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );

function FindUrl() {
    var request = require( 'request' );
    request( 'https://www.leboncoin.fr/ventes_immobilieres/1087235164.htm?ca=12_s', function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {
            var $ = cheerio.load( body );

            var span = $( 'section.properties span.value' ); // stock le tableaux ayant les data intéressantes
            //for ( var i = 0; i < span.length; i++ ) {
            //console.log( span[i].children[0].data ); // recupère les data utiles 

            // price - signe € to be a "int"
            var price = span[0].children[0].data;
            price = parseInt( Remplace( Remplace( price, "€", "" ), " ", "" ) );

            // surface-m² to be a "int"
            var surface = span[5].children[0].data;
            surface = parseInt( Remplace( surface, " m2", "" ) );

            // city and postal code
            var citycode = span[1].children[0].data;
            city = citycode.split( ' ' )[0];
            code = citycode.split( ' ' )[1];
            console.log( "city: " + city );
            console.log( "code: " + code );

            // calcul of pice per m² in order to use it 
            var pricem2 = price / surface;
            console.log( "price: " + price );
            console.log( "surface: " + surface );
            console.log( "price per m² is : " + pricem2 );
            //}


        };
    }
    )
};

function CompareDate() {

    var request = require( 'request' );
    request( 'https://www.meilleursagents.com/prix-immobilier/' + city + "-" + code, function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {
            var $ = cheerio.load( body );
        }



        //makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
        app.get( '/', function ( req, res ) {
            FindUrl();
            res.render( 'home', {
                message: FindUrl
            });
        });



        //launch the server on the 3000 port
        app.listen( 3000, function () {
            console.log( 'App listening on port 3000!' );
        });

