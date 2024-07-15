import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const createBuffer = (string: string) => {
    return Buffer.from(string)
}

const HTML_STATUS = {
    OK: `HTTP/1.1 200 OK\r\n\r\n`,
    NOT_FOUND: `HTTP/1.1 404 Not Found\r\n\r\n`
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", data => {
        const request = data.toString().split(' ')

        if(request[1] === '/') {
            return socket.write(createBuffer(HTML_STATUS.OK))
        } else {
            return socket.write(createBuffer(HTML_STATUS.NOT_FOUND))
        }
    })
    socket.end();
});

server.listen(4221, "localhost");
