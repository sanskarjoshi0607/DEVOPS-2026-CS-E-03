
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 3000;

let serverProcess;

let passed = 0;
let failed = 0;


// Print line
function printLine() {
    console.log("========================================");
}


// Test result
function testResult(testName, condition) {

    if (condition) {

        console.log(testName + ": PASS");
        passed++;

    } else {

        console.log(testName + ": FAIL");
        failed++;

    }

}


// HTTP request
function request(options) {

    return new Promise(function(resolve, reject) {

        const req = http.request(
            options,
            function(response) {

                let body = "";

                response.on("data", function(chunk) {
                    body += chunk;
                });

                response.on("end", function() {

                    resolve({
                        statusCode: response.statusCode,
                        body: body
                    });

                });

            }
        );

        req.on("error", reject);

        req.end();

    });

}


// Start server
function startServer() {

    return new Promise(function(resolve, reject) {

        serverProcess = spawn(
            process.execPath,
            ["server.js"],
            {
                cwd: __dirname,
                stdio: ["ignore", "pipe", "pipe"]
            }
        );


        serverProcess.stdout.on("data", function(data) {

            console.log(
                "Server: " + data.toString().trim()
            );

        });


        serverProcess.stderr.on("data", function(data) {

            console.error(
                "Server Error: " + data.toString().trim()
            );

        });


        serverProcess.on("error", function(error) {
            reject(error);
        });


        setTimeout(function() {
            resolve();
        }, 1500);

    });

}


// Stop server
function stopServer() {

    if (serverProcess) {
        serverProcess.kill();
    }

}


// Run tests
async function runTests() {

    printLine();

    console.log("QUIZ APP TESTING");

    printLine();


    /*
     * Read actual project files
     */

    const htmlFile = path.join(__dirname, "index.html");
    const cssFile = path.join(__dirname, "style.css");
    const jsFile = path.join(__dirname, "script.js");


    const htmlContent = fs.readFileSync(
        htmlFile,
        "utf8"
    );

    const cssContent = fs.readFileSync(
        cssFile,
        "utf8"
    );

    const jsContent = fs.readFileSync(
        jsFile,
        "utf8"
    );


    /*
     * Test 1
     */

    const pageResponse = await request({
        hostname: "localhost",
        port: PORT,
        path: "/",
        method: "GET"
    });


    testResult(
        "Test 1 - Quiz page loads",
        pageResponse.statusCode === 200
    );


    /*
     * Test 2
     */

    testResult(
        "Test 2 - Quiz title exists",
        htmlContent.includes("Quiz App Portal")
    );


    /*
     * Test 3
     */

    const cssResponse = await request({
        hostname: "localhost",
        port: PORT,
        path: "/style.css",
        method: "GET"
    });


    testResult(
        "Test 3 - CSS file loads",
        cssResponse.statusCode === 200
    );


    /*
     * Test 4
     */

    testResult(
        "Test 4 - CSS body styling exists",
        cssContent.includes("body")
    );


    /*
     * Test 5
     */

    const jsResponse = await request({
        hostname: "localhost",
        port: PORT,
        path: "/script.js",
        method: "GET"
    });


    testResult(
        "Test 5 - JavaScript file loads",
        jsResponse.statusCode === 200
    );


    /*
     * Test 6
     */

    testResult(
        "Test 6 - Quiz questions exist",
        jsContent.includes("const questions")
    );


    /*
     * Test 7
     */

    testResult(
        "Test 7 - Start button exists",
        htmlContent.includes('id="start-btn"')
    );


    /*
     * Test 8
     */

    testResult(
        "Test 8 - Next button exists",
        htmlContent.includes('id="next-btn"')
    );


    /*
     * Test 9
     */

    testResult(
        "Test 9 - Result screen exists",
        htmlContent.includes('id="result-screen"')
    );


    /*
     * Test 10
     */

    testResult(
        "Test 10 - index.html exists",
        fs.existsSync(htmlFile)
    );


    /*
     * Test 11
     */

    testResult(
        "Test 11 - style.css exists",
        fs.existsSync(cssFile)
    );


    /*
     * Test 12
     */

    testResult(
        "Test 12 - script.js exists",
        fs.existsSync(jsFile)
    );


    /*
     * Final result
     */

    printLine();

    console.log(
        "TOTAL TESTS : " + (passed + failed)
    );

    console.log(
        "PASSED      : " + passed
    );

    console.log(
        "FAILED      : " + failed
    );

    printLine();


    if (failed === 0) {

        console.log(
            "RESULT: ALL TEST CASES PASSED"
        );

    } else {

        console.log(
            "RESULT: SOME TEST CASES FAILED"
        );

    }


    printLine();


    stopServer();


    /*
     * Exit code for Jenkins
     */

    if (failed > 0) {

        process.exitCode = 1;

    } else {

        process.exitCode = 0;

    }

}


// Main
async function main() {

    try {

        await startServer();

        await runTests();

    } catch (error) {

        console.error("TEST ERROR:");
        console.error(error);

        stopServer();

        process.exitCode = 1;

    }

}


main();

