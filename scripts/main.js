const { GoogleApis } = require("googleapis");

const {google} = require('googleapis');
// console.developers.google.com
// create project with google api and download this credential json
const creds = require('./creds.json');

//create json web token
const client = new google.auth.JWT(
    creds.client_email, 
    null, 
    creds.private_key, 
    //https://developers.google.com/identity/protocols/oauth2/scopes
    ['https://www.googleapis.com/auth/spreadsheets']
);

//connect to web
client.authorize(function(err,tokens){
    //check for errors
    if(err){
        console.log(err);
        return;
    } else{
        //check for connection
        console.log('connected')
        gsrun(client);
    }
});

//once connected we can retrieve google sheets
async function gsrun(cl){
    //establish connection to gs
    const gsapi = google.sheets({version:'v4', auth: cl})
    
    //foodData
    const opt = {
        spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
        range: 'FOOD/SUPPLIES!A4:D99'
    };
    
    // shelterData
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'SHELTERS!A4:D100'
    // };

    // housingData
    // need to parse out the need from the has
    // col d ([3]) has the need col f ([5]) is the offer
    // make sure offer columng is filled
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'HOUSING!A4:F65'
    // };

    // Animal/Livestock
    // STOP AT "LOST & FOUND ANIMALS"
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'ANIMALS/LIVESTOCK!A4:D60'
    // };

    // meals
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'MEALS!A4:D70'
    // };


    // transportation
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'TRANSPORTATIONS!A4:D35'
    // };

    // emotional spiritual support
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: ''EMOTIONAL/SPIRITUAL SUPPORT'!A4:D35'
    // };

    // translation services
    // const opt = {
    //     spreadsheetId: '1qT65ynq6sQc8aMUA8XuAtYrydaMqEtf6CKgSjmvNOK4',
    //     range: 'TRANSLATION/traducción!A4:D35'
    // };



    //gets the values from the spreadsheet specified in opt
    //await lets us freaze the program until this fetch is done, so it doesn't render the page b4 getting data
    let rawData = await gsapi.spreadsheets.values.get(opt);
    var fields = rawData.data.values;

    function main() {
        let shelters = parse_rows(data)
        console.log(JSON.stringify(shelters))
    }
    
    // function to parse out the data given by google sheets
    function parse_rows(rows) {
        let entries = {};
        
        let current_city = "";
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (row.length == 1) {
                let [city] = row;
                current_city = city;
            }
            else if (row.length >= 3) {
                let [name, contact, location, desc] = [...row]
                if (!(current_city in entries)) {
                    entries[current_city] = [];
                }
                entries[current_city].push({name, contact, location, desc: desc === undefined ? "" : desc});
            }
        }
        
        return entries;
    }
    console.log(fields);

}