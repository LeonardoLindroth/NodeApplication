export class Routes {
    constructor(reqUrl) {
        const reqUrlSplit = reqUrl.split("/");

        this.routeMatches = false;

        this.contexts = [
            "user",
            "about"
        ];

        this.pages = [
            "index",
            "list",
            "show",
            "create"
        ];

        if (this.contexts.includes(reqUrlSplit[1])) {
            if (this.pages.includes(reqUrlSplit[2])) {
                this.routeMatches = true;
            }
        }
    }

    matches() {
        return this.routeMatches;
    }
}
