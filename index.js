const rs = require('text-readability')
const core = require('@actions/core')

async function run() {
    //TODO Get secret/credentials (org/repo secret/GITHUB_TOKEN)

    //TODO Create API client

    //TODO Get text to be checked

        /* TODO Need some conditionals based on directory path and/or file types
        Also need to account for manually triggered workflows using workflow_dispatch? 
        */

    //TODO Analyze text and calculate score

        //TODO Calculate multiple scores?

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
    
    let testSentence = 'Hello, this is a test sentence for checking readability. I am writing a terribly complicated sentence without any meaning just to check what happens.'
    console.log(testSentence)

    let testScore = rs.fleschKincaidGrade(testSentence)
    console.log(testScore)
}

run()