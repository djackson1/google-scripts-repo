const fs = require('fs-extra')
const path = require('path')
const { getSheets } = require('../../sheets-api/api')

const extractSpreadsheetIdFromURL = url => {
  const spreadsheetId = url.match("/d/.+/edit")[0]
  // extract the sheetId 
  return spreadsheetId.substr(3, spreadsheetId.length - 8)
}
Promise.resolve(getSheets()).then(async (sheets) => {

  // URL: https://docs.google.com/spreadsheets/d/14wefaHRKl_rrUHvFsFZl7mTaKOaA5WgVoTNA-GoO2f8/edit#gid=0
  const spreadsheetId = '14wefaHRKl_rrUHvFsFZl7mTaKOaA5WgVoTNA-GoO2f8'
  const request = {
    spreadsheetId,
    range: 'sweep!C2:C4'
  }

  res = await sheets.spreadsheets.values.get(request)
  
  const urls = res.data.values.map(d => d[0])
  console.log('urls', urls)


  // // 3. build a map of languages to mhids
  // mhids.map((mhid, idx) => {
  //   let data = languages[idx]
    
  //   hotelsToLanguageMap[mhid] = {
  //     fr: data[0] === 'x',
  //     nl: data[0] === 'x' || data[1] === 'x',
  //     de: data[2] === 'x'
  //   }
  // })



  // // consts
  // const manualNodesBlacklist = ['951', '1088', '952', '1070', '1093'] // or blank

  // // 5. load content from main sheet
  // spreadsheetId = batchConfig.dataSheet.id
  // request = {
  //   spreadsheetId
  // }
  
  // // 5.1 load mhids (Column E)
  // request.range = `${batchConfig.dataSheet.sheetName}!E3:E42876` //'Hotel - Batch 1!E3:E23150'
  // res = await sheets.spreadsheets.values.get(request)
  // mhids = res.data.values.map(([mhid]) => mhid)

  // // 5.2 load manual nodes (Column J)
  // request.range = `${batchConfig.dataSheet.sheetName}!J3:J42876`
  // res = await sheets.spreadsheets.values.get(request)
  // const manualNodes = res.data.values.map(([node]) => node)

  // // 5.3 load text values (Column M)
  // request.range = `${batchConfig.dataSheet.sheetName}!M3:M42876`
  // res = await sheets.spreadsheets.values.get(request)
  // const textValues = res.data.values.map(([text]) => text)


  // // 6 check if manual node values are not in our blacklist
  // const data = {}
  // manualNodes.map((node, idx) => {
  //   const rowId = 3 + idx

  //   if(node && node.length > 0 && !manualNodesBlacklist.includes(node) && textValues[idx] && textValues[idx].length > 0){
  //     const mhid = mhids[idx]
  //     data[rowId] = { mhid, textValue: textValues[idx], languages: hotelsToLanguageMap[mhid] }
  //   }
  // })


  // // 7. setup language data
  // const langs = ['fr', 'nl', 'de']
  // const languageData = {
  //   'fr': [],
  //   'nl': [],
  //   'de': []
  // }

  // // 8. build HTML strings
  // Object.keys(data).map((rowId, idx) => {
  //   const d = data[rowId]
  //   let { textValue } = d
  //   let classes = ''

  //   if(textValue.substr(0, 1) === '(' && textValue.substr(textValue.length - 1) === ')'){
  //     textValue = textValue.substr(1, textValue.length - 2)
  //     classes = 'lr'
  //   }

  //   langs.forEach(language => {
  //     if(d.languages[language]) {
  //       const key = `${rowId}.${d.mhid}.${classes}`
  //       const str = `<div id="${key}">${textValue}</div>`
  //       languageData[language].push(str)
  //     }
  //   })
  // })


  // const fileUploadsSplit = {}
  // langs.forEach(language => {
  //   fileUploadsSplit[language] = []
  //   const rowsPerFile = Math.ceil(languageData[language].length / filesPerLanguage[language])
    
  //   languageData[language].forEach((r, idx) => {
  //     if(idx % rowsPerFile === 0){
  //       fileUploadsSplit[language].push("")
  //     }

  //     fileUploadsSplit[language][Math.floor(idx / rowsPerFile)] += `${r}\n`
  //   })
  // })

  // langs.forEach(language => {
  //   fileUploadsSplit[language].forEach((rowData, idx) => {
  //     const exportPath = path.resolve(__dirname, '../', batchFolder, 'exports', '0.files-for-lilt', language, `file_${idx + 1}.html`)
  //     // const outputFile =  path.resolve(batchExportsToLilt, language, `${batchName}__${idx + 1}.html`)

  //     fs.outputFile(exportPath, rowData, err => {
  //       if(err){
  //         console.log('ERROR creating:', exportPath)
  //       }

  //       console.log('success creating:', exportPath)
  //     })
  //   })
  // })

  // // console.log('de1', fileUploadsSplit['de'][0])
  // // // 9. Output each language's HTML to disk
  // langs.forEach(language => {
  //   const filesForLanguage = batchConfig.filesPerLanguage[language]
  //   const filesPerUser = Math.ceil(languageData[language].length / filesForLanguage)

  //   const exportPath = path.resolve(__dirname, '../', batchFolder, 'exports', '0.files-for-lilt', language)
    
  //   // for(var i=0; i<filesForLanguage; i++){
  //   //   const filePath = path.resolve(exportPath, `file_${i + 1}.html`)

  //   // }
  // })




  //   fs.outputFile(path.resolve(__dirname, '../', batchFolder, 'exports', '0.files-for-lilt', `${language}.html`), languageData[language], (err => {
  //     if(err){
  //       console.log('err', err)
  //       return err
  //     }
  //     console.log(`created ${language}`)
  //   }))
  // })
  



  // // 10. Separate into Lilt documents
  // /*
  //   Lilt allocations:
  //   DE: 5 files
  //   NL: 3 files
  //   FR: 3 files
  // */
})
