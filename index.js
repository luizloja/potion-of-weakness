const core = require('@actions/core');
const ElixirAnalyzer = require('./app/ElixirAnalyzer.js')

try {
    // const path = core.getInput('coverageFile');
    const path = "test_coverage.txt";
    core.debug("Gosta")
    let elixirAnalyzer = new ElixirAnalyzer(path, core.getInput('minimalTestCoverage', { required: true }))
    elixirAnalyzer.execute()
} catch (error) {
    core.error(error)
}
