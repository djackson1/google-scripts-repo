const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path')

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.resolve(__dirname, 'credentials.json');
const CLIENT_SECRET_PATH = path.resolve(__dirname, 'client_secret.json')

/* IF RUNNING THIS FILE ON ITS OWN - UNCOMMENT THIS FUNC */
// fs.readFile(CLIENT_SECRET_PATH, async (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   console.log('GOOD2')
//   const auth = await authorize(JSON.parse(content))
//   listMajors(auth)
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    const token = fs.readFileSync(TOKEN_PATH)
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client
  } catch (err) {
    // rewrite this or something????
    return getNewToken(oAuth2Client, callback);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// function listMajors(auth) {
//   const sheets = google.sheets({version: 'v4', auth});
//   sheets.spreadsheets.values.get({
//     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//     range: 'Class Data!A2:E',
//   }, (err, {data}) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const rows = data.values;
//     if (rows.length) {
//       console.log('Name, Major:');
//       // Print columns A and E, which correspond to indices 0 and 4.
//       rows.map((row) => {
//         console.log(`${row[0]}, ${row[4]}`);
//       });
//     } else {
//       console.log('No data found.');
//     }
//   });
// }

/*
"A".charCodeAt(0) = 65
"a".charCodeAt(0) = 97
*/
const changeColumnWidth = (column, columnSize) => {

  return {
    "updateDimensionProperties": {
      "range": {
        "sheetId": sheetId,
        "dimension": "COLUMNS",
        "startIndex": 0,
        "endIndex": 1
      },
      "properties": {
        "pixelSize": columnSize
      },
      "fields": "pixelSize"
    }
  }
}

const batchGet = async(request) => {
  const sheets = await getSheets()
  const results = await sheets.spreadsheets.values.batchGet(request)
  return results.data.valueRanges
}

const getColumnValues = async ({ sheets, spreadsheetId, sheetName, column, startRow, endRow, valueFn }) => {
  const results =  await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${column}${startRow}:${column}${endRow}`
  })
  return results.data.values.map(valueFn)
}

const getSheets = async () => {
  // Load client secrets from a local file.
  const cs = await fs.readFileSync(path.resolve(__dirname, 'client_secret.json'))
  // Authorizes 
  const auth = await authorize(JSON.parse(cs))
  // return the sheets api
  return google.sheets({version: 'v4', auth})
}

module.exports = {
  getSheets,
  getColumnValues,
  batchGet,
}