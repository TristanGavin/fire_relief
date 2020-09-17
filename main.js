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
    
    const opt = {
        spreadsheetId: '1xiliJfE7J6UN1reDpBX3OlMi-xwrZu-N1MyX11ot2JM',
        range: 'Sheet2!A4:D94'
    };

    //gets the values from the spreadsheet specified in opt
    //await lets us freaze the program until this fetch is done, so it doesn't render the page b4 getting data
    let rawData = await gsapi.spreadsheets.values.get(opt);

    var fields = rawData.data.values;
    console.log(fields);
    
}