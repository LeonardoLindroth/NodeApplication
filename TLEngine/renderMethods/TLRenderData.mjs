import { TLRenderProperties } from "./TLRenderProperties.mjs";
import { getData } from "../../services/services.mjs";

const TLRenderData = (command, instructions, insideContent, params) => {
    let savedDataJSON = getData();

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

        TLRenderedString += TLRenderProperties(context, insertData[0], content);
    }

    return TLRenderedString;
}

export { TLRenderData }
