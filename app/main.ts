import * as net from "net";

const HTML_STATUS = {
    OK: `HTTP/1.1 200 OK\r\n\r\n`,
    NOT_FOUND: `HTTP/1.1 404 Not Found\r\n\r\n`
}

const ROUTES = {
    ROOT: '/',
    ECHO: '/echo/'
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const request = data.toString().split(' ')[1]
        console.log(request)
        if(request.startsWith(ROUTES.ECHO))  {
            const content = request.split(ROUTES.ECHO)
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\ ${content}`)
        } else {
            socket.write(HTML_STATUS.NOT_FOUND)
        }
        socket.end();
    })
});

server.listen(4221, "localhost");
