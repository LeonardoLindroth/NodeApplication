import fs from "node:fs";

import { commandsMap } from "./commandsMap.mjs";
import { getSavedData } from "../helpers/getSavedData.mjs";

const TLRenderEngine = (path) => {
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

            if (commandsMap.includes(TLCommand)) {
                let closeTLCommand = TLOperatorFileSplit[i + 2].trim();

                if (closeTLCommand === ("/" + TLCommand)) {
                    insideCommandContentIndex = i + 1;
                    let insideCommandContent = TLOperatorFileSplit[insideCommandContentIndex];
                    TLRenderedString += TLRenderData(instruction, insideCommandContent);
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

const TLRenderData = (iterableVar, insideContent) => {
    let savedDataJSON = getSavedData();

    let TLRenderedString = "";

    savedDataJSON[iterableVar].forEach((item) => {
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

const isTLCommand = (i) => {
    return (i % 2) != 0;
}

export { TLRenderEngine }
