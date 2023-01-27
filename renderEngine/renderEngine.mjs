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
            let TLCommandSplit = fileChunk.trim().split(" ");

            let TLCommand = TLCommandSplit[0];
            let instruction = TLCommandSplit[1];

            let command = TLCommand in commandsObject ? commandsObject[TLCommand] : false;

            if (command) {
                if (command.closeCommand) {
                    let closeTLCommand = TLOperatorFileSplit[i + 2].trim();

                    if (closeTLCommand === command.closeCommand) {
                        insideCommandContentIndex = i + 1;
                        let insideCommandContent = TLOperatorFileSplit[insideCommandContentIndex];
                        TLRenderedString += TLRenderData(instruction, insideCommandContent, params);
                    }
                } else {
                    TLRenderedString += TLRenderTemplate(instruction);
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

const TLRenderData = (iterableVar, insideContent, params) => {
    let savedDataJSON = getSavedData();

    let TLRenderedString = "";

    savedDataJSON[iterableVar].forEach((item) => {
        if (item.deleted) {
            TLRenderedString += "";
            return;
        }

        if (params && params.id && (parseInt(params.id, 10) != item.id)) {
            TLRenderedString += "";
            return;
        }

        let itemProperties = insideContent.split("|");

        itemProperties = itemProperties.map((itemProperty, i) => {
            if ((i % 2) != 0) {
                return item[itemProperty.trim()];
            }

            return itemProperty.trim();
        });

        TLRenderedString += itemProperties.join("");
    });

    return TLRenderedString;
}

const TLRenderTemplate = (path) => {
    const file = fs.readFileSync(path);

    return file.toString();
}

const isTLCommand = (i) => {
    return (i % 2) != 0;
}

export { TLRenderEngine }
