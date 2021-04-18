const rs = require("text-readability")
const _ = require("underscore")
const core = require("@actions/core")
const github = require("@actions/github")
const glob = require("@actions/glob")

async function run() {
	// Get Actions inputs
	const scopedFilesInput = core.getInput("files-in-scope")
	const authTokenInput = core.getInput("auth-token")
	const scopedFilesArray = scopedFilesInput.split(",").map((item) => item.trim())
	await logMessage("info", `File paths defined in workflow input: ${scopedFilesArray}`)
	
	// Instantiate octokit client
	const octokit = github.getOctokit(authTokenInput)

	// Get context data
	const context = github.context
	const owner = context.repo.owner
	const repo = context.repo.repo

	// Find all PR files and collect filepaths in array
	try {
		const prFilesData = await listPrFiles(octokit, owner, repo, context.payload.pull_request.number)
		const prFilesPaths = _.pluck(prFilesData, "filename")
		await logMessage("info", `File paths in pull request: ${prFilesPaths}`)
	} catch (error) {
		throw logMessage("error", error.message)
	}

	// Find all filepaths in scoped files, accounting for wildcards
	const scopedFilesPaths = scopedFilesArray // TO BE DELETED after above function is implemented

	// Find overlaps between scoped files and PR files
	const filePathsToProcess = _.intersection(prFilesPaths, scopedFilesPaths)
	if (filePathsToProcess.length == 0) {
		await logMessage("info", "No files in this PR are in scope for the readability check, terminating...")
		process.exit(0)
	}

	// For every applicable file path, run through content parser
	for (const filePath of scopedFilesPaths) {
		let fileContent = await parseContent(octokit, context, filePath, "ascii")
		const score = await analyzeContent(fileContent, "fleschKincaidGrade")
		// TODO separate API call below into separate function
		// TODO compile all results in a single comment
		await octokit.issues.createComment({
			owner, 
			repo, 
			issue_number: context.payload.pull_request.number,
			body: `The Flesch Kincaid Grade of file ${filePath} is: ${score}`
		})
	}

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


// Function defs

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
	await logMessage("info", `Retrieving files included in PR #${prNumber}...`)
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
 * @returns {string} Encoded text
 * @see https://octokit.github.io/rest.js/v18#repos-get-content
 */
async function parseContent(octokit, context, filePath, targetEncoding) {
	await logMessage("info", `Retrieving file content for file ${filePath} on ref ${context.ref}...`)
	const { data: fileContentObj } = await octokit.repos.getContent({
		owner: context.repo.owner,
		repo: context.repo.repo,
		ref: context.ref,
		path: filePath,
	})

	await logMessage("info", `Decoding file content for ${context.ref}/${filePath}...`)
	const fileContentBuf = new Buffer.from(fileContentObj.content, fileContentObj.encoding)
	const fileContentTargetEncoding = fileContentBuf.toString(`${targetEncoding}`)

	return fileContentTargetEncoding
}

/**
 * Analyze text content according to a specific algorithm.
 * 
 * @param {string} filePath 
 * @param {string} content 
 * @param {"fleschKincaid" | "fleschReadingEase" | "colemanLiau"} readabilityAlgo 
 * @return {number} Readability score
 */
async function analyzeContent(content, readabilityAlgo) {
	await logMessage("info", `Calculating ${readabilityAlgo}...`)
	const score = rs.fleschKincaidGrade(content)
	return score
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
