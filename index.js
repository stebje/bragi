const rs = require('text-readability');
const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

async function run() {
    // Create API client : https://octokit.github.io/rest.js/v18#usage
    const authToken = core.getInput('authToken');
    const octokit = new Octokit({
        auth: authToken
    });

    // TODO Get action event
    
        // TODO If triggered by PR...

            // Get all files in the PR
            // https://octokit.github.io/rest.js/v18#pulls-list-files

            // Check which files are in scope for the check based on workflow config

            // Pass files (and SHA?) to content parser
        // TODO If workflow_dispatch
            // Pass file to content parser

    // TODO Content parser
    // Use this to get blob content of a file for a specific SHA commit
    // https://octokit.github.io/rest.js/v18#git-get-blob
    /* const b64 = 'IyByZWFkYWJpbGl0eS1tYXRl\n'
    let buf2 = new Buffer.from(b64, 'base64')
    console.log(buf2.toString('ascii')) */
    
    // TODO Text analyzer
        //TODO For each blob, calculate scores
        //TODO Hardcoded 

    /* TODO User output:
        Add comment on PR?
            TODO What info should be in the comment?
                Readability score
                Readability improvement score (e.g. 'Previously 75, now 82, 7 points gain!' or something like that?)
                Suggestions for improvement before merging PR? (sentence/paragraph/doc level suggestions?). Might be tricky.
        Add badge inside of file? If yes:
            TODO Create badge
            TODO API call to inject badge in md file
    */
}

run()