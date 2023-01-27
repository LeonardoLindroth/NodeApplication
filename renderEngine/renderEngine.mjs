import fs from "node:fs";

import { commandsObject } from "./commandsObject.mjs";
import { getSavedData } from "../helpers/getSavedData.mjs";

const TLRenderEngine = (path, params) => {
    const file = fs.readFileSync(path);

    const fileString = file.toString();

    let TLOperatorFileSplit = fileString.split("+");

    let TLRenderedString = "";
    let insideCommandContentIndex;

    TLOperatorFileSplit.forEach((fileChunk, i) => {        
        if(isTLCommand(i)) {
            const TLCommandSplit = fileChunk.trim().split(" ");

            const TLCommand = TLCommandSplit[0];

            const instructions = TLCommandSplit.slice(1);

            const command = TLCommand in commandsObject ? commandsObject[TLCommand] : false;

            if (command) {
                if (command.closeCommand) {
                    const closeTLCommand = TLOperatorFileSplit[i + 2].trim();

                    if (closeTLCommand === command.closeCommand) {
                        insideCommandContentIndex = i + 1;
                        const insideCommandContent = TLOperatorFileSplit[insideCommandContentIndex];
                        TLRenderedString += TLRenderData(TLCommand, instructions, insideCommandContent, params);
                    }
                } else {
                    TLRenderedString += TLRenderTemplate(instructions);
                }
            }
        } else if(i === insideCommandContentIndex) {
            TLRenderedString += "";
        } else {
            TLRenderedString += fileChunk;
        }
    });

    return Buffer.from(TLRenderedString);
}

const TLRenderData = (command, instructions, insideContent, params) => {
    let savedDataJSON = getSavedData();

    let TLRenderedString = "";

    if (command === "each") {
        TLRenderedString += TLRenderEach(savedDataJSON, instructions[0], insideContent, params);
    } else if (command === "insert") {
        TLRenderedString += TLRenderInsert(savedDataJSON, instructions[0], insideContent, params);
    }

    return TLRenderedString;
}

const TLRenderEach = (savedData, context, content, params) => {
    if (!(context in savedData)) {
        return "";
    }

    let TLRenderedString = "";
    
    savedData[context].filter((item) => {
        return !item.deleted;
    }).forEach((item) => {
        TLRenderedString += TLRenderProperties(context, item, content);
    });

    return TLRenderedString;
}

const TLRenderInsert = (savedData, context, content, params) => {
    if (!(context in savedData)) throw new Error("Error");

    let TLRenderedString = "";

    if (params && params.id) {
        let insertData = savedData[context].filter((item) => { 
            return (parseInt(params.id, 10) === item.id)
        });

        if (insertData.deleted) throw new Error("Cannot be acessed");

        TLRenderedString += TLRenderProperties(context, insertData[0], content);
    }

    return TLRenderedString;
}

const TLRenderProperties = (context, item, content) => {
    let itemProperties = content.split("|");

    itemProperties = itemProperties.map((itemProperty, i) => {
        if ((i % 2) != 0) {
            const property = itemProperty.replace(context + ".", "").trim();
            return item[property];
        }

        return itemProperty.trim();
    });

    return itemProperties.join("");
}

const TLRenderTemplate = (instructions) => {
    const file = fs.readFileSync(instructions[0]);

    return file.toString();
}

const isTLCommand = (i) => {
    return (i % 2) != 0;
}

export { TLRenderEngine }
