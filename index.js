const rs = require('text-readability');
const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

async function run() {
    
    // Get input parameters
    const scopedFiles = core.getInput('files-in-scope');
    const scopedDirs = core.getInput('dirs-in-scope');
    const authToken = core.getInput('auth-token');

    // Instantiate API client
    // https://octokit.github.io/rest.js/v18#usage   
    console.log('Instantiating API client...')
    const octokit = new Octokit({
        auth: authToken
    });

    // Get GITHUB context
    console.log('Getting github context...')
    const context = github.context;

    // Collect scoped files and pass to parser
    // TODO Add support for arrays
    let filePath = 'README.md'
    console.log('Calling content parser...')
    const fileContent = await contentParser(octokit, context, filePath)
    
    // TO BE REMOVED
    // Output data
    console.log(fileContent)

    // TODO If triggered by PR, validate PR files against scoped files
    
        // TODO If triggered by PR...

            // Get all files in the PR
            // https://octokit.github.io/rest.js/v18#pulls-list-files

            // Check which files are in scope for the check based on workflow config

            // Pass files (and SHA?) to content parser
        // TODO If workflow_dispatch
            // Pass file to content parser

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

// Function: Parse content and transform to ascii
async function contentParser (octokit, context, filePath) {
    const fileContent = octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: context.ref,
        path: filePath
    })

    console.log(`File content retrieved for file ${filePath}: ${fileContent}`)

    console.log(`Decoding file content for ${context.ref}/${filePath}...`)
    const fileContentBuf = new Buffer.from(fileContent.data.content, fileContent.data.encoding)
    const fileContentAscii = fileContentBuf.toString('ascii')

    console.log(fileContentAscii)

    return fileContentAscii
};

async function contentAnalyzer () {
    // TODO
};

async function commenter () {
    // TODO
};

run()