import querystring from "querystring";

const buildObjectData = (uriString) => {
    let objectData = {};

    uriString.forEach((data) => {
        let pairKeyValue = decodeURIComponent(data).split("=");

        objectData[pairKeyValue[0]] = pairKeyValue[1];
    });

    return objectData;
}

const parseData = (uriString) => {
    return querystring.parse(uriString);
}

export { buildObjectData, parseData };