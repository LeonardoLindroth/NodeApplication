const http = require("node:http");
const fs = require("node:fs");
const { hostname } = require("node:os");

const port = "3000";

const requisitionMethods = {
    get: "GET",
    post: "POST"
}

const readFile = (path, req, res) => {
    fs.readFile(path, (error, data) => {
        if (error) {
            res.writeHead(400, {"Content-Type": "text/plain"})
            res.write("Error 400: Bad Request");
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        }
    });
}

const server = http.createServer((req, res) => {
    if (req.method === requisitionMethods.get) {
        let fullPath = "./views/";

        let path = req.url;

        if (req.url.at(-1) === "/") {
            path += "index.html";
        }

        readFile(fullPath + path, req, res);
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})