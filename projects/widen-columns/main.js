const fs = require('fs-extra')
const path = require('path')
const { getSheets, changeColumnWidth } = require('../../sheets-api/api')

const extractSpreadsheetIdFromURL = url => {
  const spreadsheetId = url.match("/d/.+/edit")[0]
  // extract the sheetId 
  return spreadsheetId.substr(3, spreadsheetId.length - 8)
}
async function forEachAsync (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function buildSheetMap (spreadsheetId) {
  const request = await SHEETS.spreadsheets.get({ spreadsheetId })  
  const sheetsMap = request.data.sheets.map(n => n.properties)

  return {
    map: sheetsMap,
    getAllSheetIds: () => sheetsMap.map(({ sheetId }) => sheetId),
    getSheetIdFromName: sheetName => sheetsMap.find(({ title }) => title === sheetName).sheetId
  }
}


const getSpreadsheetSingleRange = async (spreadsheetId, sheetName, range) => {
  const results = await SHEETS.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${range}`
  })  
  return results.data.values.map(value => value[0])
}

let SHEETS = null
Promise.resolve(getSheets()).then(async (sheets) => {
  // make our sheets object global so functions don't have to pass it in all the time
  SHEETS = sheets

  // Use our id extraction function to show it works... who needs tests right?
  const spreadsheetId = extractSpreadsheetIdFromURL('https://docs.google.com/spreadsheets/d/14wefaHRKl_rrUHvFsFZl7mTaKOaA5WgVoTNA-GoO2f8/edit#gid=0')
    
  const fn3 = async () => {
    const request3 = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetsMap = request3.data.sheets.map(n => n.properties)

    const getSheetIdFromName = sheetName => sheetsMap.find(({ title }) => title === sheetName).sheetId
    const sheetId = getSheetIdFromName('sweep') 

    const colWidth = 100
    const arr = []
    for(var i=0; i<26;i++){
      arr.push(changeColumnWidth(sheetId, String.fromCharCode(65 + i), colWidth))
    }

    const res2 = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: arr
      }
    })
    console.log('res2', res2)
  }
  await fn3()
  
  

  // This function loads a range from a spreadsheet and changes the widths of columns
  const fn4 = async () => {
    // load all the values in the [C2:C4 range] on the [sweep] sheet for our main [spreadsheet] 
    const urls = await getSpreadsheetSingleRange(spreadsheetId, 'sweep', 'C2:C4')

    // custom for each function to allow async
    await forEachAsync(urls, async (url) => {
      // extract the id from the url
      const linkSpreadsheetId = extractSpreadsheetIdFromURL(url)
      // get meta data from the spreadsheet id we just extracted
      const { getAllSheetIds, getSheetIdFromName, map } = await buildSheetMap(linkSpreadsheetId)

      // get all the sheets
      const sheetIds = getAllSheetIds()
      
      // for [all sheets] change columns [A to Z]'s width to [70] pixels
      const colWidth = 100
      const arr = []
      sheetIds.forEach(sheetId => {
        for(var i=0; i<26;i++){
          arr.push(changeColumnWidth(sheetId, String.fromCharCode(65 + i), colWidth))
        }
      })

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: linkSpreadsheetId,
        resource: {
          requests: arr
        }
      })
    })
  }
  await fn4()



  const fn5 = async () => {

  }
  // fn5()
})
