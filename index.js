const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');


try {
    const path = core.getInput('file');
    const files = core.getInput('modified_files');
    console.log("Files Modified", files)
    const data = fs.readFileSync(path, 'utf8');

    let coverageData = data.split("\n")
    let coverageDataMap = {}
    coverageData.forEach( line => {
        if(line.match(/ *[0-9]{1,2}\.[0-9]{2}% \| .*$/)){
            let slpitedData = line.split("|")
            let percentage = parseFloat(slpitedData[0].trim().replace("%",""))  
            let moduleName = slpitedData[1].trim()
            coverageDataMap[moduleName] = percentage
        }
    })
    console.log(coverageDataMap)
} catch (error) {
    console.log(error)
}