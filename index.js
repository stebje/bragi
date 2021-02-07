const rs = require("text-readability")
const core = require("@actions/core")
const github = require("@actions/github")

async function run() {
	// Initialize variables
	const scopedFilesInput = core.getInput("files-in-scope")
	const authTokenInput = core.getInput("auth-token")
	const context = github.context
	const scopedFilesArray = scopedFilesInput.split(",").map((item) => item.trim())
	const octokit = github.getOctokit(authTokenInput)
	const owner = context.repo.owner
	const repo = context.repo.repo

	// Initialize constants and defaults
	const WILDCARDS = ["*"]

	console.log(`File paths defined in input: ${scopedFilesArray}`)

	// Find all PR files
	// TODO Only get files that have been added or updated (not deleted)
	const prFilesData = listPrFiles(octokit, owner, repo, context.payload.pull_request.number)

	// TODO Check PR files against scoped files
	// Collect files in array
	// If none are found, exit

	// TODO If array is not empty, for each file...
	// Parse content
	// Analyze content

	// For every applicable file path, run through content parser
	scopedFilesArray.forEach(async (filePath) => {
		await parseContent(octokit, context, filePath)
	})

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
async function parseContent(octokit, context, filePath) {
	console.log(`Retrieving file content for file ${filePath} on ref ${context.ref}...`)
	const { data: fileContentObj } = await octokit.repos.getContent({
		owner: context.repo.owner,
		repo: context.repo.repo,
		ref: context.ref,
		path: filePath,
	})

	console.log(`Decoding file content for ${context.ref}/${filePath}...`)
	const fileContentBuf = new Buffer.from(fileContentObj.content, fileContentObj.encoding)
	const fileContentAscii = fileContentBuf.toString("ascii")

	return fileContentAscii
}

/**
 * Find all PR files
 * 
 * @param {Object} octokit 
 * @param {string} owner 
 * @param {string} repo 
 * @param {number} prNumber 
 * @see https://octokit.github.io/rest.js/v18#pulls-list-files
 */
async function listPrFiles(octokit, owner, repo, prNumber) {
	console.log(`Retrieving files included in PR #${prNumber}...`)
	const prFiles = await octokit.paginate(octokit.pulls.listFiles, {
		owner,
		repo,
		pull_number: prNumber,
	})

	return prFiles
}

async function analyzeContent() {
	// TODO
	// Which rulesets and tools to apply?
	// https://www.npmjs.com/package/textlint-rule-rousseau
	// https://www.npmjs.com/package/text-readability
}

async function suggestChanges() {
	// TODO
}

async function createComment() {
	// TODO
}

run()
