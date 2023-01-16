const http = require("node:http");
const fs = require("node:fs");
const { hostname } = require("node:os");

const port = "3000";

const MIMETypes = {
    "txt": "text/plain",
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "default": "application/octet-stream"
}

const requisitionMethods = {
    get: "GET",
    post: "POST"
}

const buildPath = (req, res) => {
    let fullPath = "./views/";

    let path = req.url;

    if (req.url.at(-1) === "/") {
        path += "index.html";
    }

    return fullPath + path;
}

const readFile = (path, req, res) => {
    fs.readFile(path, (error, data) => {
        if (error) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.write("Error 404: Not Found");
            res.end();
        } else {
            let ext = path.split(".").at(-1);

            res.writeHead(200, 
                {"Content-Type": ext in MIMETypes ? MIMETypes[ext] : MIMETypes["default"]}
            );
            res.write(data);
            res.end();
        }
    });
}

const server = http.createServer((req, res) => {
    if (req.method === requisitionMethods.get) {
        if (req.url.includes("..")) {
            res.writeHead(400, {"Content-type": "text/plain"});
            res.write("Error 400: Bad Request");
            res.end();
        } else {
            readFile(buildPath(req, res), req, res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})