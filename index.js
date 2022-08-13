const core = require('@actions/core');
const github = require('@actions/github');

try {
    const name = core.getInput('path');
    console.log(name)
} catch (error) {
    
}