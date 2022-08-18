const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

class AbstractAnalyzer {

	constructor(testCoverageFile, minimalTestCoverage) {
		this.testCoverageFile = testCoverageFile
		this.minimalTestCoverage = minimalTestCoverage
	}

	async execute() {
		const fileData = fs.readFileSync(this.testCoverageFile, 'utf8');
		const coverageMap = this.loadMapPercentages(fileData)

		const filesMap = await this.loadModifiedFiles()
		const entitiesName = Object.keys(filesMap).map(fileName => {
			return this.extractEntitiesName(fileName, filesMap[fileName])
		}).flat()
		core.info("Analyzing files: ")
		this.analyzeFiles(entitiesName, coverageMap, this.minimalTestCoverage)
	}

	/**
	 * The core of this function was taken from https://github.com/jitterbit/get-changed-files/blob/master/src/main.ts
	 * Special thanks for jitterbit
	 */
	async findModifiedFiles() {
		// Create GitHub client with the API token.
		const context= github.context

		const client = new github.getOctokit(core.getInput('token', { required: true }))

		// Get event name.
		const eventName = context.eventName

		// Define the base and head commits to be extracted from the payload.
		let base = null
		let head = null

		switch (eventName) {
			case 'pull_request':
				base = context.payload.pull_request.base.sha
				head = context.payload.pull_request.head.sha
				break
			case 'push':
				base = context.payload.before
				head = context.payload.after
				break
			default:
				core.setFailed(
					`This action only supports pull requests and pushes, ${context.eventName} events are not supported. ` +
					"Please submit an issue on this action's GitHub repo if you believe this in correct."
				)
		}

		// // Log the base and head commits
		// core.info(`Base commit: ${base}`)
		// core.info(`Head commit: ${head}`)

		// Ensure that the base and head properties are set on the payload.
		if (!base || !head) {
			core.setFailed(
				`The base and head commits are missing from the payload for this ${context.eventName} event. ` +
				"Please submit an issue on this action's GitHub repo."
			)
		}

		// Use GitHub's compare two commits API.
		// https://developer.github.com/v3/repos/commits/#compare-two-commits
		return client.rest.repos.compareCommits({
			base,
			head,
			owner: context.repo.owner,
			repo: context.repo.repo
		}).then(response => {
			// Ensure that the request was successful.
			if (response.status !== 200) {
				core.setFailed(
					`The GitHub API for comparing the base and head commits for this ${context.eventName} event returned ${response.status}, expected 200. ` +
					"Please submit an issue on this action's GitHub repo."
				)
			}

			// Ensure that the head commit is ahead of the base commit.
			if (response.data.status !== 'ahead') {
				core.setFailed(
					`The head commit for this ${context.eventName} event is not ahead of the base commit. ` +
					"Please submit an issue on this action's GitHub repo."
				)
			}

			// Get the changed files from the response payload.
			const files = response.data.files
			let changedFiles = []
			for (const file of files) {
				if(file.status == 'added' || file.status == 'modified'){
					changedFiles.push(file.filename)  
				}
			}
			return changedFiles
		}).catch(err => {
			core.setFailed(err)
		})
	}

	async loadModifiedFiles() {
		let filesMap = {}
		const modifiedFiles = await this.findModifiedFiles()
		// core.info(`Files modidifed: ${JSON.stringify(modifiedFiles, null, 4)}`)
		modifiedFiles.map(fileName => {
			filesMap[fileName] = fs.readFileSync(fileName, 'utf8');
		})
		return filesMap;
	}

	loadMapPercentages() { }

	extractEntitiesName() { }

	analyzeFiles() { }

}

module.exports = AbstractAnalyzer