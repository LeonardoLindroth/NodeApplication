import fs from "node:fs";

const TLRenderTemplate = (instructions) => {
    const file = fs.readFileSync(instructions[0]);

    return file.toString();
}

export { TLRenderTemplate }
