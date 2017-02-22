//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );

var estimation = {
    Title: "Estimation du bien",
    Averageprice: 0,
    Verdict: "",
}
var lbcData = {
    price: 0,
    city: 0,
    type: 0,
    surface: 0,
}
var med = {
    medprice: 0,
}

app.get( '/', function ( req, res ) {
    if ( req.query.lienLBC ) {
        request( req.query.lienLBC, function ( error, response, body ) {

            if ( !error && response.statusCode == 200 ) {
                const $ = cheerio.load( body )
                const lbcDataArray = $( 'section.properties span.value' )
                lbcData = {
                    price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                    city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /\_|\s/g, '-' ),
                    type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),
                    surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )
                }
                med.medprice = lbcData.price / lbcData.surface

            }
            else { console.log( error ) }
        }
        )
    }

    var url = 'https://www.meilleursagents.com/prix-immobilier/' + lbcData.city.toLowerCase

    request( url, function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {
            const $ = cheerio.load( body );
            var averageprice = "";
            var a = $( this )
            if ( type == "Appartement" ) {
                if ( a.children()[0].next.data == "Prix m² appartement" ) {
                    averageprice = a.next().next().text();
                    averageprice = averageprice.substring( 14, 19 );
                    averagePrice = averagePrice.split( " " );
                    estimation.Averageprice = averageprice[0] + averageprice[1];
                }
            }
            if ( type == "Maison" ) {
                if ( a.children()[0].next.data == "Prix m² maison" ) {
                    averageprice = a.next().next().text();
                    averageprice = averageprice.substring( 14, 19 );
                    averagePrice = averagePrice.split( " " );
                    estimation.Averageprice = averageprice[0] + averageprice[1];
                }
            }
        }
    })


    if ( estimation.Averageprice < med.medprice ) {
        estimation.Verdict = "the price is too expensive, don't be a fool !";
    }
    else if ( estimation.Averageprice == med.medprice ) {
        estimation.Verdict = "the price is fair";

    }
    else {
        estimation.Verdict = "the price is smaller than expected, be carefull";
    }
    //}*/
    res.render( 'home', {

        message: lbcData.price,
        message2: lbcData.surface,
        message3: lbcData.city,
        message4: lbcData.type,
        message5: med.medprice,
        message6: estimation.Averageprice,
        message7: estimation.Verdict,
    });
});


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory




//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});


