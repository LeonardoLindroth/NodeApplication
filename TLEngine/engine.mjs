import fs from "node:fs";

import { engineCommands } from "./engineCommands.mjs";

import { TLRenderData } from "./renderMethods/TLRenderData.mjs";
import { TLRenderTemplate } from "./renderMethods/TLRenderTemplate.mjs";

const isTLCommand = (i) => {
    return (i % 2) != 0;
}

const engine = (path, params) => {
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

            const command = TLCommand in engineCommands ? engineCommands[TLCommand] : false;

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

export { engine }
