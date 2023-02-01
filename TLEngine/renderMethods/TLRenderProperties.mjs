const TLRenderProperties = (context, savedItem, content) => {
    let itemProperties = content.split("|");

    itemProperties = itemProperties.map((itemProperty, i) => {
        if ((i % 2) != 0) {
            const propertySplit = itemProperty.trim().split(" ");

            const property = removeContextFromProperty(propertySplit[0], context);

            let propertyString = "";

            if (propertySplit.length > 1) {
                const conditions = sanitizeConditions(propertySplit.slice(1));
                propertyString = TLRenderPropertiesWithLogic(savedItem, property, conditions);
            } else {
                propertyString = savedItem[property];
            }

            return propertyString;
        }

        return itemProperty.trim();
    });

    return itemProperties.join("");
}

const TLRenderPropertiesWithLogic = (savedItem, property, conditions) => {
    let propertyString = "";

    switch(conditions[0]) {
        case "==":
            if (savedItem[property] == conditions[1]) {
                propertyString = " " + conditions[3] + " ";
            } else {
                propertyString = conditions[5];
            }
            break;
        case "?":
            if (parseInt(savedItem[property], 10)) {
                propertyString = " " + conditions[1] + " ";
            } else {
                propertyString = conditions[3];
            }
        case "default":
            break;
    }

    return propertyString;
}

const sanitizeConditions = (conditions) => {
    return conditions.map((condition) => {
        return String(condition.replaceAll("\"", ""));
    });
}

const removeContextFromProperty = (property, context) => {
    return property.replace(context + ".", "").trim();
}

export { TLRenderProperties }
