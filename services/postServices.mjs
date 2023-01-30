import fs from "node:fs";

import { getSavedData } from "../helpers/getSavedData.mjs";

import { exec } from "node:child_process";

const enableFirebase = true;
const firebaseURL = "https://nodeserver-bf6b2-default-rtdb.firebaseio.com/";

const saveData = (addingData, context, res) => {
    let savedDataJSON = getSavedData();

    if (!(context in savedDataJSON)) {
        savedDataJSON = Object.assign(savedDataJSON, {[context]: []});
    }

    const newId = savedDataJSON[context].length;

    addingData = Object.assign(addingData, {"id": newId, "deleted": 0});

    savedDataJSON[context].push(addingData);

    manageAppData(savedDataJSON, "Saved with success", res);
}

const updateData = (updatingData, context, res) => {
    let savedDataJSON = getSavedData();

    savedDataJSON[context] = savedDataJSON[context].map((item) => {
        if (item.id === parseInt(updatingData.id, 10)) {
            updatingData.id = parseInt(updatingData.id, 10);
            updatingData = Object.assign(updatingData, {"deleted": 0});
            return updatingData;
        }

        return item;
    });

    manageAppData(savedDataJSON, "Actualized with success", res);
}

const deleteData = (deletingData, context, res) => {
    let savedDataJSON = getSavedData();

    savedDataJSON[context] = savedDataJSON[context].map((item) => {
        if (item.id === parseInt(deletingData.id, 10)) {
            item.deleted = 1;
            deletingData = Object.assign(deletingData, item);

            return deletingData;
        }

        return item;
    });

    manageAppData(savedDataJSON, "Deleted with success", res);
}

const manageAppData = (dataJSON, message, res) => {
    const data = JSON.stringify(dataJSON);

    if (enableFirebase) {
        const url = firebaseURL + "/app.json";

        exec("curl -X PUT -d '" + data + "' '" + url + "'", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }

    fs.writeFile("./app.json", data, (error) => {
        if (error) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: false, message: "Erro" }));
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify({ success: true, message: message }));
            res.end();
        }
    });
}

export { saveData, updateData, deleteData };
