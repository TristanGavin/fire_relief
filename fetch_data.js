const fs = require("fs");
const path = require("path");
const {google} = require("googleapis");
const creds = require("./nicecock.json");

function create_client() {
    const client = new google.auth.JWT(
        creds.client_email,
        null,
        creds.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
    );

    client.authorize((err, tokens) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected.");
        }
    });
    
    return client;
}

async function fetch_sheet_data(client, spreadsheetId, range) {
    try {
        const gsapi = google.sheets({version: "v4", auth: client});
        let raw_data = await gsapi.spreadsheets.values.get({spreadsheetId, range});
        return raw_data.data.values;
    }
    catch (error) {
        console.log("ERROR:");
        console.error(error);
    }
}

function parse_translation(rows) {
    let entries = [];
    
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (row.length >= 4) {
            let [name, contact, language, desc] = [... row];
            entries.push({name, contact, language, desc, id: i});
        }
    }
    
    return entries;
}

function parse_nocity(rows) {
    let entries = [];
    
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (row.length >= 3) {
            let [name, contact, location, desc] = [... row];
            entries.push({name, contact, location, desc, id: i});
        }
    }
    
    return entries;
}

function parse_housing(rows) {
    let entries = {};
    
    let current_city = "";
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (row.length == 1) {
            let [city] = row;
            current_city = city;
        }
        else if (row.length >= 6) {
            let [name, contact, location, desc_need, _, desc_offer] = [...row]
            if (desc_offer !== "") {
                if (!(current_city in entries)) {
                    entries[current_city] = [];
                }
                entries[current_city].push({name, contact, location, id: i, desc: desc_offer});
            }
        }
    }
    
    return entries;
}

function parse_donation(rows) {
    let entries = {};
    
    let current_city = "";
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (row.length == 1) {
            let [city] = row;
            current_city = city;
        }
        else if (row.length >= 4) {
            let [name, contact, location, time_open, desc] = [...row]
            if (!(current_city in entries)) {
                entries[current_city] = [];
            }
            entries[current_city].push({name, contact, location, time_open, id: i,  desc: desc === undefined ? "" : desc});
        }
    }
    
    return entries;
}

function parse_common(rows) {
    let entries = {};
    
    let current_city = "";
    for (let i = 0; i < rows.length; i++) {
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
            entries[current_city].push({name, contact, location, id: i, desc: desc === undefined ? "" : desc});
        }
    }
    
    return entries;
}

const spreadsheetData = [
    {
        name: 'food',
        range: 'FOOD/SUPPLIES/Comida/Alimentos!A5:D110',
        parse: parse_common
    },
    {
        name: 'shelters',
        range: 'SHELTERS/Refugios!A5:D100',
        parse: parse_common
    },
    {
        name: 'housing',
        range: 'HOUSING!A8:F65',
        parse: parse_housing
    },
    {
    // Animal/Livestock
    // STOP AT "LOST & FOUND ANIMALS"
        name: 'animals',
        range: 'ANIMALS/LIVESTOCK!A5:D60',
        parse: parse_common
    },
    {
        name: 'meals',
        range: 'MEALS!A5:D70',
        parse: parse_common
    },
    {
        // no city here
        name: 'transportation',
        range: 'TRANSPORTATION!A4:D35',
        parse: parse_nocity
    },
    {
        name: 'emotional',
        range: "'EMOTIONAL/SPIRITUAL SUPPORT'!A4:D35",
        parse: parse_nocity
    },
    {
        name: 'translation',
        range: 'TRANSLATION/traducción!A5:D35',
        parse: parse_translation
    },
    {
        name: 'donations',
        range: "'DONATION DROP OFF'!A5:E35",
        parse: parse_donation
    }
];

let spreadsheetId = "1bMlKA19-JPenGF3tYJ9NJ5HZyMo6XlndIkBPKUb0LsI";
let client = create_client();
for (let i = 0; i < spreadsheetData.length; i++) {
    let opt = spreadsheetData[i];
    fetch_sheet_data(client, spreadsheetId, opt.range)
    .then(values => {
        let entries = opt.parse(values);
        let filepath = path.join(__dirname, `./data/${opt.name}.json`);
        fs.writeFileSync(filepath, JSON.stringify({entries}));
        console.log(`Wrote to "${filepath}"`);
    });
}