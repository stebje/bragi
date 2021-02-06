const rs = require('text-readability');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    
    // Initialize
    const scopedFilesInput = core.getInput('files-in-scope');
    const authTokenInput = core.getInput('auth-token');
    const context = github.context;
    const scopedFilesArray = scopedFilesInput.split(',').map((item) => item.trim())
    const octokit = github.getOctokit(authTokenInput)
    
    console.log(`File paths defined in input: ${scopedFilesArray}`)

    // TODO If wildcards are used, find all matching documents in repository
    //...
    
    // TODO If directories are specified, find all matching documents in repository directories
    // ...

    // TODO Find union of "wildcards" docs AND "directory" docs, this is the set of applicable docs (directory and wildcard docs could be overlapping)
    // ... 
    // If array length == 0 , then exit, else trigger main flow

    // TODO Print all matched docs
    // ...
    
    // TODO If triggered by PR push, cross-correlate with PR files
        // Get all files in the PR
        // https://octokit.github.io/rest.js/v18#pulls-list-files

        // Get intersect of file paths

    // For every applicable file path, run through content parser
    scopedFilesArray.forEach(async filePath => {
        await parseContent(octokit, context, filePath)
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
async function parseContent (octokit, context, filePath) {
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

async function listScopedFiles () {
    // TODO
}

async function analyzeContent () {
    // TODO
// Which rulesets and tools to apply?
    // https://www.npmjs.com/package/textlint-rule-rousseau
    // https://www.npmjs.com/package/text-readability
};

async function suggestChanges () {
    // TODO
}

async function createComment () {
    // TODO
};

run()
