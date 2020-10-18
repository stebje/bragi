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
    const scopedFilesArray = scopedFiles.split(',').map((item) => item.trim())
    
    // TODO If triggered by PR push, cross-correlate with PR files
        // Get all files in the PR
        // https://octokit.github.io/rest.js/v18#pulls-list-files

        // Get intersect of file paths

    // For every applicable file path, run through content parser
    scopedFilesArray.forEach(async filePath => {
        await contentParser(octokit, context, filePath)
    });

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
    console.log(`Retrieving file content for file ${filePath} on ref ${context.ref}...`)
    const { data: fileContentObj } = await octokit.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: context.ref,
        path: filePath
    })

    console.log(`Decoding file content for ${context.ref}/${filePath}...`)
    const fileContentBuf = new Buffer.from(fileContentObj.content, fileContentObj.encoding)
    const fileContentAscii = fileContentBuf.toString('ascii')

    return fileContentAscii
};

async function contentAnalyzer () {
    // TODO
};

async function commenter () {
    // TODO
};

run()