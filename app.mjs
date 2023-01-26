import http from "node:http";
import fs from "node:fs";
import { hostname } from "node:os";

const port = "3000";

import { MIMETypes } from "./helpers/mimeTypes.mjs";
import { requisitionMethods } from "./helpers/requisitionMethods.mjs";
import { buildObjectData } from "./helpers/buildObjectData.mjs";
import { getSavedData } from "./helpers/getSavedData.mjs";

import { TLRenderEngine } from "./renderEngine/renderEngine.mjs";

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

const saveData = (addingData, req, res) => {
    let savedDataJSON = getSavedData();

    let url = req.url.split("/");

    savedDataJSON[url[1]].push(addingData);

    let insertData = JSON.stringify(savedDataJSON);

    fs.writeFile("./app.json", insertData, (error) => {
        if (error) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: false, message: "Erro" }));
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: true, message: "Valor salvo!" }));
            res.end();
        }
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
        let url = req.url.split("/");

        switch(url[2]) {
            case "add":
                saveData(objectData, req, res);
            case "update":
                // updateData
            case "delete":
                // deleteData
            case "default":
                return;
        }
    });
}

const render = (path, req, res) => {
    if (path.includes(".tl")) {
        let bufferTLString = TLRenderEngine(path);

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
                render(buildPath(url), req, res);
            }
        }
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})