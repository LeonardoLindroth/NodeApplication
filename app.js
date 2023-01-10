const http = require("node:http");
const { hostname } = require("node:os");

const port = "3000";

const server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Teste");
    res.end();
});

server.listen(port, hostname, () => {
    console.log("Server running");
})