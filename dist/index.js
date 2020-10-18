module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(622);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 347:
/***/ (function(module) {

module.exports = eval("require")("text-readability");


/***/ }),

/***/ 622:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const rs = __webpack_require__(347);
const core = __webpack_require__(968);
const github = __webpack_require__(706);
const { Octokit } = __webpack_require__(818);

async function run() {
    
    // Get input parameters
    const scopedFiles = core.getInput('files-in-scope');
    const scopedDirs = core.getInput('dirs-in-scope');
    const authToken = core.getInput('auth-token');

    // Instantiate API client
    // https://octokit.github.io/rest.js/v18#usage   
    core.debug('Instantiating API client...')
    const octokit = new Octokit({
        auth: authToken
    });

    // Get GITHUB context
    const context = github.context;

    // Collect scoped files and pass to parser
    // TODO Add support for arrays
    let filePath = 'README.md'
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
        path: `${context.ref}/${filePath}`
    })

    const fileContentBuf = new Buffer.from(fileContent.data.content, fileContent.data.encoding)
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

/***/ }),

/***/ 706:
/***/ (function(module) {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 818:
/***/ (function(module) {

module.exports = eval("require")("@octokit/rest");


/***/ }),

/***/ 968:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });