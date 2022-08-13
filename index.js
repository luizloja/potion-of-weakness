const core = require('@actions/core');
const github = require('@actions/github');

try {
    const name = core.getInput('file');
    console.log(name)
} catch (error) {
    
}