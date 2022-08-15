class AbstractAnalyzer {

	constructor(testCoverageFile, files, minimalTestCoverage){
		this.files = files
		this.testCoverageFile = testCoverageFile
		this.minimalTestCoverage = minimalTestCoverage
	}

	execute() {
		this.coverageMap = this.loadMapPercentages()
		this.entitiesName = this.extractEntitiesName()
		this.analyzeFiles()		
	}

	loadMapPercentages(){}

	extractEntitiesName(){}

	analyzeFiles(){}

}

module.exports = AbstractAnalyzer