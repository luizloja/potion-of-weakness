const AbstractAnalyzer = require('./AbstractAnalyzer.js');
const fs = require('fs');

class ElixirAnalyzer extends AbstractAnalyzer {

	constructor(files, testCoverageFile, minimalTestCoverage) {
		super(files, testCoverageFile, minimalTestCoverage);
	}

	loadMapPercentages() {
		const data = fs.readFileSync(this.testCoverageFile, 'utf8');
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

	extractEntitiesName() {
		return this.files.map( file => {
        const data = fs.readFileSync(file, 'utf8');
        let filteredLines = data.split("\n").filter(line => line.match(/defmodule.*/))
        return filteredLines.map(line => line.replace(/(defmodule *)|( *do *)/g,"") )
    }).flat()
	}

	analyzeFiles() {
		this.entitiesName.forEach( moduleName => {
			if( this.coverageMap[moduleName] >= 0 && this.coverageMap[moduleName] < this.minimalTestCoverage ){
					console.log(`Module ${moduleName} has only ${this.coverageMap[moduleName]}% test coverage. It is necessary at least ${this.minimalTestCoverage}% of coverage.` )
			}
	})
	}

}

module.exports = ElixirAnalyzer