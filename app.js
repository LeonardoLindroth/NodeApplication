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

const buildObjectData = (uriString) => {
    let objectData = {};

    uriString.forEach((data) => {
        let pairKeyValue = decodeURIComponent(data).split("=");

        objectData[pairKeyValue[0]] = pairKeyValue[1];
    });

    return objectData;
}

const buildPath = (urlPath) => {
    let fullPath = "./views";

    if (urlPath.includes("assets")) {
        fullPath = ".";
    }

    fullPath += urlPath;

    if (urlPath.at(-1) === "/") {
        fullPath += "index.html";
    }

    return fullPath;
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
    let bodyData = "";

    req.on("data", (chunk) => {
        bodyData += chunk.toString();
    });

    req.on("end", () => {
        bodyData = bodyData.split("&");

        let objectData = buildObjectData(bodyData);
    });

    let url = req.url;

    if (req.url.includes("?")) {
        const splittedUrl = req.url.split("?");
        url = splittedUrl[0];

        let params = splittedUrl[1];

        let objectData = buildObjectData(params.split("&"));
    }

    if (req.method === requisitionMethods.get) {
        if (url.includes("..")) {
            res.writeHead(403, {"Content-type": "text/plain"});
            res.write("Error 403: Forbiden error");
            res.end();
        } else {
            readFile(buildPath(url), req, res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})