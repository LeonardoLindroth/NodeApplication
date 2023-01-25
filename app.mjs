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

    if (!fullPath.includes(".tl")) {
        fullPath += ".html";
    }

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

const renderContentEngine = (path, req, res) => {
    if (path.includes(".tl")) {
        const file = fs.readFileSync(path);

        const fileString = file.toString();

        console.log(file);
        console.log(fileString);

        let buffer = fs.readFileSync("./app.json");

        let json = JSON.parse(buffer.toString());

        let stringSplit = fileString.split("+");

        if (stringSplit[1].includes("each")) {
            let iterator = stringSplit[1].trim().split(" ");

            let buildEach = "";

            json[iterator[1]].forEach((user) => {
                let properties = stringSplit[2].split("|");

                properties[1] = user[properties[1].trim()];

                properties[3] = user[properties[3].trim()];

                properties[5] = user[properties[5].trim()];

                buildEach += properties.join("");
            });

            console.log(buildEach);

            let finalString = stringSplit[0] +""+ buildEach +""+ stringSplit[4];

            let bufferData = Buffer.from(finalString);

            res.writeHead(200, 
                {"Content-Type": MIMETypes["html"]}
            );
            res.write(bufferData);
            res.end();
        }
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
                renderContentEngine(buildPath(url), req, res);
            }
        }
    }
});

server.listen(port, hostname, () => {
    console.log("Server running");
})