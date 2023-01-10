const http = require("node:http");
const fs = require("node:fs");
const { hostname } = require("node:os");

const port = "3000";

const server = http.createServer((req, res) => {
    fs.readFile("./index.html", (error, data) => {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});

server.listen(port, hostname, () => {
    console.log("Server running");
})