const core = require('@actions/core');
const AbstractAnalyzer = require('./AbstractAnalyzer.js');

class ElixirAnalyzer extends AbstractAnalyzer {

	constructor(files, testCoverageFile, minimalTestCoverage) {
		super(files, testCoverageFile, minimalTestCoverage);
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
		entitiesName.forEach(moduleName => {
			if (coverageMap[moduleName] >= 0 && coverageMap[moduleName] < this.minimalTestCoverage) {
				core.info(`Module ${moduleName} has only ${coverageMap[moduleName]}% test coverage. It is necessary at least ${minimalTestCoverage}% of coverage.`)
			}
		})
	}

}

module.exports = ElixirAnalyzer