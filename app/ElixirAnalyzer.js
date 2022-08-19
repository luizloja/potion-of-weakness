const core = require('@actions/core');
const AbstractAnalyzer = require('./AbstractAnalyzer.js');

class ElixirAnalyzer extends AbstractAnalyzer {

	constructor(testCoverageFile, minimalTestCoverage) {
		super(testCoverageFile, minimalTestCoverage);
	}

	loadMapPercentages(data) {
		let coverageData = data.split("\n")
		let coverageDataMap = {}
		coverageData.forEach(line => {
			if (line.match(/ *[0-9]{1,2}\.[0-9]{2}% \| .*$/)) {
				let slpitedData = line.split("|")
				let percentage = parseFloat(slpitedData[0].trim().replace("%", ""))
				let moduleName = slpitedData[1].trim()
				coverageDataMap[moduleName] = percentage
			}
		})
		return coverageDataMap
	}

	extractEntitiesName(fileName, fileData) {
			let filteredLines = fileData.split("\n").filter(line => line.match(/defmodule.*/))
			return filteredLines.map(line => line.replace(/(defmodule *)|( *do *)/g, ""))
	}

	analyzeFiles(entitiesName, coverageMap, minimalTestCoverage) {
		core.info(`The minimal percentage dcoverage defined is ${minimalTestCoverage}%.`)
		entitiesName.forEach(moduleName => {
			if (coverageMap[moduleName] >= 0 && coverageMap[moduleName] < minimalTestCoverage) {
				core.info(`\u001b[85;85;255;0;0mModule ${moduleName} has only ${coverageMap[moduleName]}% test coverage. More tests, teeeeeests`)
			}else if(coverageMap[moduleName] >= 0 && coverageMap[moduleName] >= minimalTestCoverage){
				core.info(`\u001b[85;255;85mModule ${moduleName} has ${coverageMap[moduleName]}% test coverage. Great, dude.`)
			}
		})
	}

}

module.exports = ElixirAnalyzer