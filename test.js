function callleboncoin() {
    var url = ''

    request( url, function ( error, response, html ) {
        if ( error && response.statusCode == 200 ) {
            const $ = cheerio.load( html )
            const lbcDataArray = $( 'section.properties span.values' )
            let lbcData = {
                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                city: $( lbcDataArray.get( 1 ) ).trim().toLowerCase().replace( /\_|\s/g, '-' ),
                type: $( lbcDataArray.get( 2 ) ).trim().toLowerCase(),
                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )
            }
            console.log( lbcData )
        }
        else { console.log( error ) }
    }
    )
}