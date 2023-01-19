const buildObjectData = (uriString) => {
    let objectData = {};

    uriString.forEach((data) => {
        let pairKeyValue = decodeURIComponent(data).split("=");

        objectData[pairKeyValue[0]] = pairKeyValue[1];
    });

    return objectData;
}

export { buildObjectData };