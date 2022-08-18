const core = require('@actions/core');
const github = require('@actions/github');

const ElixirAnalyzer = require('./app/ElixirAnalyzer.js')


try {
    // const path = core.getInput('coverageFile');
    const path = "test_coverage.txt";
    const files = ["lib/schema/schema.ex"]
    const minimalTestCoverage = 70
    let elixirAnalyzer = new ElixirAnalyzer(path, minimalTestCoverage)
    elixirAnalyzer.execute()
   // console.log(coverageDataMap)
} catch (error) {
    console.log(error)
}
