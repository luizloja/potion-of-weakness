class AbstractAnalyzer {

	constructor(testCoverageFile, files, minimalTestCoverage){
		this.files = files
		this.testCoverageFile = testCoverageFile
		this.minimalTestCoverage = minimalTestCoverage
	}

	execute() {
		const fileData = fs.readFileSync(this.testCoverageFile, 'utf8');
		const coverageMap = this.loadMapPercentages(fileData)

		const filesMap = this.loadModifiedFiles()
		const entitiesName = Object.keys(filesMap).map(fileName => { 
			 return this.extractEntitiesName(fileName, filesMap[fileName])
		}).flat()
		
		this.analyzeFiles(entitiesName, coverageMap, minimalTestCoverage)		
	}

	loadModifiedFiles() {
		let filesMap = {}
		this.files.map( fileName => {
			filesMap[fileName] = fs.readFileSync(file, 'utf8');
		})
		return filesMap;
	}

	loadMapPercentages(){}

	extractEntitiesName(){}

	analyzeFiles(){}

}

module.exports = AbstractAnalyzer