import fs from "node:fs";

const getSavedData = () => {
    let savedData = fs.readFileSync("./app.json");

    let savedDataJSON = JSON.parse(savedData.toString());

    return savedDataJSON;
}

export { getSavedData };
