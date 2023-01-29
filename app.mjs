import http from "node:http";
import fs from "node:fs";
import { hostname } from "node:os";

const port = "3000";

import { MIMETypes } from "./helpers/mimeTypes.mjs";
import { requisitionMethods } from "./helpers/requisitionMethods.mjs";
import { buildObjectData } from "./helpers/buildObjectData.mjs";

import { TLRenderEngine } from "./renderEngine/renderEngine.mjs";

import { saveData, updateData, deleteData } from "./services/postServices.mjs";

import { Routes } from "./routes/routes.mjs";

const buildPath = (urlPath) => {
    if (urlPath.includes("assets")) return "." + urlPath;

    if (urlPath === "/") return "./views/index.tl";

    let fullPath = "./views" + urlPath;

    const routes = new Routes(urlPath);

    if (routes.matches()) {
        fullPath += ".tl";
    }

    return fullPath;
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
        const objectData = buildObjectData(bodyData);

        const url = req.url.split("/");
        const context = url[1];
        const action = url[2];

        switch(action) {
            case "add":
                saveData(objectData, context, res);
                break;
            case "update":
                updateData(objectData, context, res);
                break;
            case "delete":
                deleteData(objectData, context, res);
                break;
            case "default":
                break;
        }
    });
}

const render = (path, req, res, params) => {
    if (path.includes(".tl")) {
        let bufferTLString = TLRenderEngine(path, params);

        res.writeHead(200, 
            {"Content-Type": MIMETypes["html"]}
        );
        res.write(bufferTLString);
        res.end();
    } else {
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
}

const server = http.createServer((req, res) => {
    if (req.method === requisitionMethods.post) {
        handlePost(req, res);
    } else {
        let url = req.url;
        let params;

        if (req.url.includes("?")) {
            const splittedUrl = req.url.split("?");
            url = splittedUrl[0];

            let urlParams = splittedUrl[1];

            params = buildObjectData(urlParams.split("&"));
        }

        if (req.method === requisitionMethods.get) {
            if (url.includes("..")) {
                res.writeHead(403, {"Content-type": "text/plain"});
                res.write("Error 403: Forbiden error");
                res.end();
            } else {
                render(buildPath(url), req, res, params);
            }
        }
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})