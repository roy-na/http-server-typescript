import * as net from "net";

const HTML_STATUS = {
    OK: `HTTP/1.1 200 OK\r\n\r\n`,
    NOT_FOUND: `HTTP/1.1 404 Not Found\r\n\r\n`
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString().split(' ')
        if(request[1] === '/') {
            socket.write(HTML_STATUS.OK)
        } else {
            socket.write(HTML_STATUS.NOT_FOUND)
        }
        socket.end();
    })
});

server.listen(4221, "localhost");
