import http from "node:http";
import fs from "node:fs";
import { hostname } from "node:os";

const port = "3000";

import { MIMETypes } from "./helpers/mimeTypes.mjs";
import { requisitionMethods } from "./helpers/requisitionMethods.mjs";
import { buildObjectData } from "./helpers/buildObjectData.mjs";

import routes from "./routes/routes.mjs";

const pathMatchesDefaultRoute = (urlPath) => {
    let pathRoute = urlPath.split("/");

    pathRoute = pathRoute.slice(2);

    return routes.includes(pathRoute.join("/"));
}

const buildPath = (urlPath) => {
    if (urlPath.includes("assets")) return "." + urlPath;

    let fullPath = "./views" + urlPath;

    if (pathMatchesDefaultRoute(fullPath)) {
        fullPath += "/";
    }

    if (fullPath.at(-1) === "/") {
        fullPath += "index";
    }

    fullPath += ".html";

    return fullPath;
}

const saveData = (data, req, res) => {
    let buffer = fs.readFileSync("./app.json");

    let json = JSON.parse(buffer.toString());

    json["users"].push(data);

    let insertData = JSON.stringify(json);

    fs.writeFile("./app.json", insertData, (error) => {
        if (error) throw error;

        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify({success: true, message: "Valor salvo!"}));
        res.end();
    })
}

const handlePost = (req, res) => {
    let bodyData = "";

    req.on("data", (chunk) => {
        bodyData += chunk.toString();

        if (bodyData.length > 1e6) {
            bodyData = "";
            res.writeHead(413, {'Content-Type': 'text/plain'}).end();
            req.connection.destroy();
        }
    });

    req.on("end", () => {
        bodyData = bodyData.split("&");

        let objectData = buildObjectData(bodyData);

        console.log(req.url);

        saveData(objectData, req, res);
    });
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
    if (req.method === requisitionMethods.post) {
        handlePost(req, res);
    } else {
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
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})