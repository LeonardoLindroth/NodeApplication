import fs from "node:fs";

import { getSavedData } from "../helpers/getSavedData.mjs";

const saveData = (addingData, req, res) => {
    let savedDataJSON = getSavedData();

    let url = req.url.split("/");

    let id = savedDataJSON[url[1]+"s"].length;

    addingData = Object.assign(addingData, {"id": id, "deleted": 0});

    savedDataJSON[url[1]+"s"].push(addingData);

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

const updateData = (updatingData, req, res) => {
    let savedDataJSON = getSavedData();

    let url = req.url.split("/");

    savedDataJSON[url[1]+"s"] = savedDataJSON[url[1]+"s"].map((item) => {
        if (item.id === parseInt(updatingData.id, 10)) {
            updatingData.id = parseInt(updatingData.id, 10);
            updatingData = Object.assign(updatingData, {"deleted": 0});
            return updatingData;
        }

        return item;
    });

    let insertData = JSON.stringify(savedDataJSON);

    fs.writeFile("./app.json", insertData, (error) => {
        if (error) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: false, message: "Erro" }));
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: true, message: "Valor atualizado!" }));
            res.end();
        }
    });
}

const deleteData = (deletingData, req, res) => {
    let savedDataJSON = getSavedData();

    let url = req.url.split("/");

    savedDataJSON[url[1]+"s"] = savedDataJSON[url[1]+"s"].map((item) => {
        if (item.id === parseInt(deletingData.id, 10)) {
            item.deleted = 1;
            deletingData = Object.assign(deletingData, item);

            return deletingData;
        }

        return item;
    });

    let insertData = JSON.stringify(savedDataJSON);

    fs.writeFile("./app.json", insertData, (error) => {
        if (error) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: false, message: "Erro" }));
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: true, message: "Valor atualizado!" }));
            res.end();
        }
    });
}

export { saveData, updateData, deleteData };
