const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {

    let filePath;

    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    }
    else if (req.url === "/style.css") {
        filePath = path.join(__dirname, "style.css");
    }
    else if (req.url === "/script.js") {
        filePath = path.join(__dirname, "script.js");
    }
    else {
        res.writeHead(404);
        res.end("404 - File Not Found");
        return;
    }

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(500);
            res.end("500 - Server Error");
            return;
        }

        let contentType = "text/html";

        if (filePath.endsWith(".css")) {
            contentType = "text/css";
        }

        if (filePath.endsWith(".js")) {
            contentType = "text/javascript";
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });

});

server.listen(PORT, () => {
    console.log(`Quiz App Server running at http://localhost:${PORT}`);
});