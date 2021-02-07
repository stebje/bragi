const rs = require("text-readability")
const _ = require("underscore")
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
	const fileObjects = []
	const fileObject = {}

	// Initialize constants and defaults
	const WILDCARDS = ["*"]

	console.log(`File paths defined in input: ${scopedFilesArray}`)

	// Find all PR files and collect filepaths in array
	let prFilesData
	let prFilesPaths
	try {
		prFilesData = await listPrFiles(octokit, owner, repo, context.payload.pull_request.number)
		prFilesPaths = _.pluck(prFilesData, "filename")
		console.log(prFilesPaths)
	} catch (error) {
		// TODO Call error handler
		throw error
	}

	if (_.intersection(prFilesPaths, scopedFilesArray).length == 0) {
		//console.log("No files in this PR are in scope for the readability check, terminating...")
		await logMessage("info", "No files in this PR are in scope for the readability check, terminating...")
		//core.info("\u001b[35mNo files in this PR are in scope for the readability check, terminating...")
		// TODO Call commenter function
		process.exit(0)
	}

	// TODO Check PR files against scoped files
	// Collect files in array
	// If none are found, exit

	// For every applicable file path, run through content parser
	for (const filePath of scopedFilesArray) {
		let fileContent = await parseContent(octokit, context, filePath, "ascii")
		let grade = rs.fleschKincaidGrade(fileContent)
		console.log(grade)
	}

	/* scopedFilesArray.forEach(async (filePath) => {
		await parseContent(octokit, context, filePath, "ascii")
	}) */

	// TODO If array is not empty, for each file...
	// Parse content
	// Analyze content

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

/**
 * Parse content and transform to target encoding
 *
 * @param {*} octokit
 * @param {*} context
 * @param {string} filePath
 * @param {string} targetEncoding
 * @see https://octokit.github.io/rest.js/v18#repos-get-content
 */
async function parseContent(octokit, context, filePath, targetEncoding) {
	console.log(`Retrieving file content for file ${filePath} on ref ${context.ref}...`)
	const { data: fileContentObj } = await octokit.repos.getContent({
		owner: context.repo.owner,
		repo: context.repo.repo,
		ref: context.ref,
		path: filePath,
	})

	console.log(`Decoding file content for ${context.ref}/${filePath}...`)
	const fileContentBuf = new Buffer.from(fileContentObj.content, fileContentObj.encoding)
	const fileContentTargetEncoding = fileContentBuf.toString(`${targetEncoding}`)

	return fileContentTargetEncoding
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

/**
 * Logs and output a message. Allows styling of log messages according to its type (warning, info etc)
 * 
 * @param {"info" | "warning" | "error"} type - The type of message
 * @param {string} text - The log message text
 */
async function logMessage (type, text) {
	const infoTextColor = "\u001b[35m" // Magenta
	const warningTextColor = "\u001b[43m" // Yellow
	const errorTextColor = "\u001b[38;2;255;0;0m" // Red

	const infoTextPrefix = "💡 Info: "
	const warningTextPrefix = "🔔 Warning: "
	const errorTextPrefix = "❌ Error: "

	switch (type) {
		case "info":
			core.info(`${infoTextColor}${infoTextPrefix}${text}`)
			break
		case "warning":
			core.warning(`${warningTextColor}${warningTextPrefix}${text}`)
			break
		case "error":
			core.error(`${errorTextColor}${errorTextPrefix}${text}`)
			break
		default:
			break
	}
}

run()
